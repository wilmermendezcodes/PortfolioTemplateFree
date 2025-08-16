# Supabase + Vercel Deployment Guide

Deploy your Cozy Recommendations app using Supabase as the database and Vercel for hosting.

## Step 1: Set Up Supabase

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and fill project details
4. Wait for database provisioning (2-3 minutes)

### Configure Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-setup.sql`
3. Run the script to create all tables and security policies

### Get Supabase Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **Anon public key** (SUPABASE_ANON_KEY)
   - **Service role key** (SUPABASE_SERVICE_ROLE_KEY) - optional

### Enable Authentication (Optional)
1. Go to Authentication → Settings
2. Configure providers as needed
3. Set site URL to your Vercel domain

## Step 2: Deploy to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel
```

### Option B: GitHub Integration
1. Push code to GitHub repository
2. Connect repository in Vercel dashboard
3. Vercel will auto-deploy

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

**Required:**
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

**Optional for enhanced features:**
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 4: Configure Database Connection

The app automatically detects Supabase credentials and uses them for database connections. No additional configuration needed!

## Features Included

### Database Features
- ✅ PostgreSQL with Row Level Security (RLS)
- ✅ Real-time subscriptions ready
- ✅ User authentication integration
- ✅ Automatic schema migrations
- ✅ Performance indexes

### Security Features
- ✅ Row Level Security policies
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Session management
- ✅ CORS protection

### Vercel Features
- ✅ Serverless functions
- ✅ Edge optimization
- ✅ Automatic HTTPS
- ✅ Git-based deployments
- ✅ Environment variable management

## Database Schema

Your Supabase database includes:
- `users` - User profiles and preferences
- `recommendations` - AI-generated content suggestions
- `favorites` - User's saved recommendations
- `activities` - User interaction logging
- `user_sessions` - Session management
- `audit_logs` - Security audit trail
- `rate_limits` - API rate limiting

## Monitoring & Maintenance

### Supabase Dashboard
- Monitor database performance
- View real-time usage
- Manage authentication
- Check logs and metrics

### Vercel Dashboard
- Monitor function performance
- View deployment logs
- Manage domains
- Analytics and insights

## Scaling Considerations

### Database Scaling
- Supabase auto-scales to 500GB
- Connection pooling included
- Read replicas available in Pro plan

### Function Scaling
- Vercel auto-scales serverless functions
- No server management required
- Pay per execution model

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Verify SUPABASE_URL format
- Check SUPABASE_ANON_KEY is correct
- Ensure RLS policies allow access

**Authentication Issues:**
- Check Supabase Auth settings
- Verify site URL in Supabase
- Confirm environment variables

**Function Timeout:**
- Check Vercel function logs
- Optimize database queries
- Consider function timeout limits

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Discord](https://discord.supabase.com)

Your app will be live at: `https://your-project.vercel.app`

## Performance Tips

1. **Database Optimization:**
   - Use indexes for frequently queried columns
   - Implement connection pooling
   - Monitor query performance

2. **Vercel Optimization:**
   - Enable Edge Functions for global performance
   - Use Vercel Analytics
   - Configure proper caching headers

3. **Security Best Practices:**
   - Regularly rotate API keys
   - Monitor audit logs
   - Keep dependencies updated