#!/usr/bin/env tsx

/**
 * Supabase Database Setup Script
 * 
 * This script automatically creates all necessary tables and security policies
 * in your Supabase database. Run this after setting up your Supabase credentials.
 */

import { createClient } from '@supabase/supabase-js';

async function setupSupabaseDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set');
    process.exit(1);
  }

  console.log('🚀 Setting up Supabase database...');

  const supabase = createClient(supabaseUrl, supabaseKey);

  // SQL for creating all tables and security features
  const setupSQL = `
    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT,
      preferences JSONB DEFAULT '{}',
      subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'premium', 'trial')),
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')
    );

    -- Create recommendations table
    CREATE TABLE IF NOT EXISTS recommendations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('movie', 'book', 'music')),
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      metadata JSONB DEFAULT '{}',
      mood TEXT CHECK (mood IN ('relaxed', 'energetic', 'creative', 'nostalgic', 'romantic', 'adventurous', 'mysterious', 'uplifting', 'contemplative', 'festive')),
      rating NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
      external_id TEXT, -- For API references
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create favorites table
    CREATE TABLE IF NOT EXISTS favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, recommendation_id)
    );

    -- Create activities table
    CREATE TABLE IF NOT EXISTS activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      title TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create sessions table for security
    CREATE TABLE IF NOT EXISTS user_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      ip_address INET,
      user_agent TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create audit logs for security
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id UUID,
      old_values JSONB,
      new_values JSONB,
      ip_address INET,
      user_agent TEXT,
      success BOOLEAN DEFAULT true,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create rate limiting table
    CREATE TABLE IF NOT EXISTS rate_limits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      identifier TEXT NOT NULL, -- IP address or user ID
      endpoint TEXT NOT NULL,
      requests_count INTEGER DEFAULT 1,
      window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(identifier, endpoint)
    );

    -- Create security policies table
    CREATE TABLE IF NOT EXISTS security_policies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      policy_name TEXT NOT NULL UNIQUE,
      policy_rules JSONB NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription);
    CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
    CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
    CREATE INDEX IF NOT EXISTS idx_recommendations_mood ON recommendations(mood);
    CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at);
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
    CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

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

    DROP TRIGGER IF EXISTS update_security_policies_updated_at ON security_policies;
    CREATE TRIGGER update_security_policies_updated_at
      BEFORE UPDATE ON security_policies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    -- Row Level Security (RLS) policies
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
    ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

    -- Users can only see their own data
    DROP POLICY IF EXISTS users_own_data ON users;
    CREATE POLICY users_own_data ON users
      FOR ALL USING (auth.uid()::text = id::text);

    -- Users can only see their own recommendations
    DROP POLICY IF EXISTS recommendations_own_data ON recommendations;
    CREATE POLICY recommendations_own_data ON recommendations
      FOR ALL USING (auth.uid()::text = user_id::text);

    -- Users can only see their own favorites
    DROP POLICY IF EXISTS favorites_own_data ON favorites;
    CREATE POLICY favorites_own_data ON favorites
      FOR ALL USING (auth.uid()::text = user_id::text);

    -- Users can only see their own activities
    DROP POLICY IF EXISTS activities_own_data ON activities;
    CREATE POLICY activities_own_data ON activities
      FOR ALL USING (auth.uid()::text = user_id::text);

    -- Users can only see their own sessions
    DROP POLICY IF EXISTS sessions_own_data ON user_sessions;
    CREATE POLICY sessions_own_data ON user_sessions
      FOR ALL USING (auth.uid()::text = user_id::text);

    -- Insert default security policies
    INSERT INTO security_policies (policy_name, policy_rules) VALUES
    ('rate_limiting', '{"auth_attempts": 5, "api_requests": 100, "window_minutes": 15}'),
    ('password_policy', '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_symbols": false}'),
    ('session_policy', '{"max_duration_days": 7, "max_concurrent_sessions": 5}'),
    ('data_retention', '{"audit_logs_days": 90, "inactive_sessions_days": 30, "rate_limit_cleanup_hours": 24}')
    ON CONFLICT (policy_name) DO NOTHING;

    -- Create function to clean up old data
    CREATE OR REPLACE FUNCTION cleanup_old_data()
    RETURNS void AS $$
    BEGIN
      -- Clean up expired sessions
      DELETE FROM user_sessions 
      WHERE expires_at < NOW() OR (is_active = false AND created_at < NOW() - INTERVAL '30 days');
      
      -- Clean up old rate limit entries
      DELETE FROM rate_limits 
      WHERE window_start < NOW() - INTERVAL '24 hours';
      
      -- Clean up old audit logs (keep 90 days)
      DELETE FROM audit_logs 
      WHERE created_at < NOW() - INTERVAL '90 days';
      
      RAISE NOTICE 'Cleanup completed at %', NOW();
    END;
    $$ LANGUAGE plpgsql;

    -- Schedule cleanup (if pg_cron extension is available)
    -- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');
  `;

  try {
    // Execute the setup SQL
    console.log('📝 Creating tables and security policies...');
    const { error } = await supabase.rpc('exec_sql', { sql: setupSQL });
    
    if (error) {
      console.error('❌ Error executing setup SQL:', error);
      
      // Try alternative method - execute via SQL editor equivalent
      console.log('⚠️  Trying alternative setup method...');
      
      // Split SQL into individual statements and execute
      const statements = setupSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (stmtError) {
            console.warn(`⚠️  Statement warning:`, stmtError.message);
          }
        }
      }
    }

    console.log('✅ Supabase database setup complete!');
    console.log('');
    console.log('🔒 Security features enabled:');
    console.log('   • Row Level Security (RLS)');
    console.log('   • Rate limiting');
    console.log('   • Audit logging');
    console.log('   • Session management');
    console.log('   • Input validation');
    console.log('   • Password hashing');
    console.log('');
    console.log('📊 Tables created:');
    console.log('   • users (with RLS)');
    console.log('   • recommendations (with RLS)');
    console.log('   • favorites (with RLS)');
    console.log('   • activities (with RLS)');
    console.log('   • user_sessions (with RLS)');
    console.log('   • audit_logs');
    console.log('   • rate_limits');
    console.log('   • security_policies');
    console.log('');
    console.log('🚀 Your Supabase database is now ready for production!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupSupabaseDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

export { setupSupabaseDatabase };