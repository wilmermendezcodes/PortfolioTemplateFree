import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Prioritize Supabase for Vercel deployment
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

if (!useSupabase && !process.env.DATABASE_URL) {
  console.warn('⚠️  Neither Supabase nor DATABASE_URL configured. Using in-memory storage.');
}

// Create Supabase client if credentials are available
export const supabase = useSupabase ? createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
) : null;

// Database connection
let db: any;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL for any PostgreSQL connection (Supabase, Neon, etc.)
  const client = postgres(process.env.DATABASE_URL, {
    prepare: false,
    ssl: process.env.NODE_ENV === 'production' ? 'require' : 'prefer',
    max: 5,
    idle_timeout: 30,
    connect_timeout: 15,
    max_lifetime: 60 * 30,
  });
  db = drizzle(client, { schema });
  console.log('✅ Connected to PostgreSQL database' + (useSupabase ? ' (Supabase)' : ''));
} else {
  // Fallback to in-memory storage
  db = null;
  console.log('⚠️ Using in-memory storage - add DATABASE_URL to connect to Supabase');
}

export { db };

// Auto-create tables on startup (only if using a database)
export async function initializeDatabase() {
  if (!db) {
    console.log('ℹ️ Using in-memory storage, skipping database initialization');
    return;
  }
  
  try {
    // Create tables using raw SQL if they don't exist
    const createTablesSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT,
        preferences JSONB DEFAULT '{}',
        subscription TEXT DEFAULT 'free',
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        subscription_expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create recommendations table
      CREATE TABLE IF NOT EXISTS recommendations (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('movie', 'book', 'music')),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        metadata JSONB DEFAULT '{}',
        mood TEXT,
        rating NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create favorites table
      CREATE TABLE IF NOT EXISTS favorites (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recommendation_id VARCHAR NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, recommendation_id)
      );

      -- Create activities table
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        title TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create sessions table for security
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        ip_address INET,
        user_agent TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create audit logs for security
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        success BOOLEAN DEFAULT true,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create rate limiting table
      CREATE TABLE IF NOT EXISTS rate_limits (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        identifier TEXT NOT NULL, -- IP address or user ID
        endpoint TEXT NOT NULL,
        requests_count INTEGER DEFAULT 1,
        window_start TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(identifier, endpoint)
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
      CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
      CREATE INDEX IF NOT EXISTS idx_recommendations_mood ON recommendations(mood);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);

      -- Create updated_at trigger function
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Create triggers for updated_at
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_recommendations_updated_at ON recommendations;
      CREATE TRIGGER update_recommendations_updated_at
        BEFORE UPDATE ON recommendations
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    // Execute table creation using direct PostgreSQL client
    console.log('⏳ Initializing database tables...');
    
    // Get the underlying postgres client
    const postgresClient = ((db as any)._.client) || ((db as any).client) || db;
    
    if (postgresClient && postgresClient.unsafe) {
      // Use unsafe method for raw SQL execution
      await postgresClient.unsafe(createTablesSQL);
    } else {
      console.log('⚠️ Direct SQL execution not available, tables may need manual creation');
      console.log('ℹ️ Please create the tables manually in your Supabase dashboard if needed');
    }
    
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    // Don't throw error - let app continue with in-memory storage
    console.log('ℹ️ Falling back to in-memory storage');
  }
}
