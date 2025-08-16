-- Supabase Setup Script for Cozy Recommendations App
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  preferences JSONB DEFAULT '{}',
  subscription TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  mood TEXT,
  rating NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table for security
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit logs for security
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
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

-- Enable Row Level Security (RLS) for enhanced security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid()::uuid);

-- Create RLS policies for recommendations
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create own recommendations" ON recommendations
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Create RLS policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (user_id = auth.uid()::uuid);

-- Create RLS policies for activities
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can create own activities" ON activities
  FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;