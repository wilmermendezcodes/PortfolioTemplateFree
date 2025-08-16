# Local Development Setup

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **PostgreSQL database** (Supabase recommended)

## Quick Setup

### Option A: Automatic Setup (Recommended)
```bash
node local-dev.js
```
This will:
- Install dependencies
- Create .env file from template  
- Build the project
- Guide you through configuration

### Option B: Manual Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Environment Variables
Copy `.env.example` to `.env` and edit:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
NODE_ENV=development
PORT=5000
```

#### 3. Database Setup
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase-setup.sql` in Supabase SQL Editor
3. Get credentials from Settings → API and Settings → Database

#### 4. Build and Start
```bash
npm run build
npm run dev
```

## Alternative: Local PostgreSQL

If you prefer local PostgreSQL:

1. Install PostgreSQL locally
2. Create a database: `createdb cozy_recommendations`
3. Set DATABASE_URL: `postgresql://username:password@localhost:5432/cozy_recommendations`
4. Run: `npm run db:push` to create tables

## Troubleshooting

### "Application is starting up" Message
This happens when:
- Build files are missing
- Environment variables not configured
- Database connection issues

**Solution:**
1. Run `npm run build` first
2. Check `.env` file exists with correct values
3. Verify database connection

### Build Issues
If build fails:
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall/network settings
- Ensure database server is running

## File Structure for Local Development

```
cozy-recommendations/
├── .env                    # Your environment variables
├── package.json           # Dependencies and scripts
├── client/                # React frontend
├── server/                # Express backend
├── shared/                # Shared types/schemas
├── dist/                  # Built files (auto-generated)
└── LOCAL-SETUP.md         # This file
```

## Development Workflow

1. **Frontend changes**: Auto-reloads via Vite
2. **Backend changes**: Auto-reloads via tsx
3. **Database changes**: Run `npm run db:push`
4. **Full restart**: `npm run dev`

Your app will be available at: `http://localhost:5000`