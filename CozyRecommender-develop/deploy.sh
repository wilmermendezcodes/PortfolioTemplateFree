#!/bin/bash

# Cozy Recommendations - Supabase + Vercel Deployment Script
set -e

echo "🚀 Starting deployment to Vercel with Supabase..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel deploy --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add environment variables:"
echo "   - SUPABASE_URL (your Supabase project URL)"
echo "   - SUPABASE_ANON_KEY (your Supabase anon key)"
echo "   - DATABASE_URL (your Supabase database connection string)"
echo "   - NODE_ENV=production"
echo "3. Run the SQL script in your Supabase dashboard"
echo "4. Test your deployed application"
echo ""
echo "🔗 Your app will be available at the domain shown above"