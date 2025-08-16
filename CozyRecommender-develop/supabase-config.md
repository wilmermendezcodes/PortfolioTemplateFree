# Supabase Configuration for Vercel Deployment

## Getting Your Supabase Database Connection String

### Step 1: Get Your Supabase Connection String
1. Go to your Supabase dashboard
2. Click on your project
3. Go to Settings → Database
4. Find "Connection string" section
5. Copy the "Connection pooling" string (recommended for production)

### Step 2: Environment Variables for Vercel

Add these to your Vercel project environment variables:

```bash
# Required for database connection
DATABASE_URL=postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Required for Supabase client features
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Required for production
NODE_ENV=production
```

### Step 3: Database Setup
1. Copy the contents of `supabase-setup.sql`
2. Go to your Supabase dashboard → SQL Editor
3. Paste and run the script to create all tables

### Connection String Format

**For Connection Pooling (Recommended):**
```
postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

**For Direct Connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

### Security Notes
- Use connection pooling for better performance in serverless environments
- Keep your database password secure
- Regularly rotate your API keys
- Enable Row Level Security (RLS) policies

### Testing Your Connection
The app will automatically test the Supabase connection on startup and fall back to in-memory storage if there are issues.