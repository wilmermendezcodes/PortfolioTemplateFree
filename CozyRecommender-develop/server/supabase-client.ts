// Enhanced Supabase client for Vercel deployment
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are available
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials not found. Some features may be limited.');
}

// Create Supabase client with optimized settings for serverless
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application': 'cozy-recommendations',
      },
    },
  }
);

// Helper function to test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// Helper to get database status
export async function getDatabaseStatus() {
  try {
    const { data, error } = await supabase.rpc('version');
    return {
      connected: !error,
      version: data,
      error: error?.message
    };
  } catch (error) {
    return {
      connected: false,
      error: 'Connection failed'
    };
  }
}