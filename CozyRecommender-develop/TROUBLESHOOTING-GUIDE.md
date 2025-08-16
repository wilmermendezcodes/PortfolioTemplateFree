# Troubleshooting Guide
## Comprehensive Issue Resolution for Cozy Recommendation Platform

### 📋 Quick Reference
- [Critical Issues](#critical-issues)
- [Database Problems](#database-problems)
- [API Failures](#api-failures)
- [Frontend Issues](#frontend-issues)
- [Authentication Problems](#authentication-problems)
- [Performance Issues](#performance-issues)
- [Deployment Problems](#deployment-problems)

---

## 🚨 Critical Issues

### 1. Database Parameter Error (URGENT)
**Error**: `PostgresError: there is no parameter $1`
**Location**: Security event logging in authentication
**Impact**: Authentication works but security logging fails

**Root Cause**: SQL query parameter mismatch in security logging function

**Solution**:
```typescript
// server/middleware/security.ts - Fix the logging function
async function logSecurityEvent(event: SecurityEvent) {
  try {
    // ❌ Incorrect parameter binding
    // await db.execute(sql`INSERT INTO security_logs VALUES ${event}`)
    
    // ✅ Correct parameter binding
    await db.execute(sql`
      INSERT INTO security_logs (action, ip_address, user_agent, endpoint, method, metadata, timestamp) 
      VALUES (${event.action}, ${event.ip_address}, ${event.user_agent}, ${event.endpoint}, ${event.method}, ${event.metadata}, ${event.timestamp})
    `)
  } catch (error) {
    console.error('Security logging failed:', error)
    // Don't throw - security logging failure shouldn't break auth
  }
}
```

**Quick Fix**:
1. Comment out security logging temporarily
2. Create security_logs table in Supabase
3. Update parameter binding in logging function

---

## 🗄️ Database Problems

### Connection Issues
**Symptoms**: 
- "Failed to connect to PostgreSQL"
- Timeout errors
- SSL connection failures

**Diagnosis Steps**:
```bash
# 1. Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  process.exit();
});
"

# 2. Check SSL requirements
node -e "console.log(process.env.DATABASE_URL.includes('sslmode'))"

# 3. Verify Supabase status
curl -I https://supabase.com/dashboard
```

**Solutions**:
1. **Invalid DATABASE_URL**: Check format `postgresql://user:pass@host:port/db?sslmode=require`
2. **SSL Issues**: Add `?sslmode=require` to connection string
3. **Connection Limits**: Implement connection pooling
4. **Network Issues**: Test from different network/location

### Schema Synchronization
**Symptoms**:
- Table doesn't exist errors
- Column not found errors
- Migration failures

**Diagnosis**:
```bash
# Check current schema
npm run db:push --dry-run

# Verify tables in Supabase dashboard
# SQL Editor > Run query:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Solutions**:
```sql
-- 1. Create missing tables manually in Supabase SQL Editor
-- 2. Run schema push
-- 3. Verify foreign key constraints

-- Example: Create users table if missing
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

### Query Performance Issues
**Symptoms**:
- Slow API responses
- Database timeouts
- High CPU usage

**Diagnosis**:
```sql
-- Check slow queries in Supabase
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Solutions**:
1. **Add Indexes**: Create indexes on frequently queried columns
2. **Optimize Queries**: Use EXPLAIN ANALYZE to identify bottlenecks
3. **Connection Pooling**: Implement pgBouncer or similar
4. **Query Caching**: Add Redis caching layer

---

## 🛠️ API Failures

### 500 Internal Server Errors
**Common Causes**:
1. Unhandled exceptions in route handlers
2. Database connection failures
3. Invalid environment variables
4. Validation errors not caught

**Debugging Process**:
```typescript
// Add comprehensive error logging
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    timestamp: new Date().toISOString()
  })
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  })
})
```

### CORS Errors
**Symptoms**: 
- "CORS policy blocked the request"
- OPTIONS requests failing
- Different origins not allowed

**Solutions**:
```typescript
// server/middleware/cors.ts
import cors from 'cors'

const corsOptions = {
  origin: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'https://your-vercel-domain.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))
```

### Rate Limiting Issues
**Symptoms**:
- 429 Too Many Requests
- Users blocked unexpectedly
- API becoming unresponsive

**Solutions**:
```typescript
// Adjust rate limits based on usage patterns
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 for heavy usage
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/api/health'
  }
})
```

---

## ⚛️ Frontend Issues

### React Query Errors
**Symptoms**:
- Infinite loading states
- Stale data not updating
- Query cache issues

**Debugging**:
```typescript
// Add React Query DevTools (development only)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      {/* Your app */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}

// Debug specific queries
const { data, error, isLoading, isError } = useQuery({
  queryKey: ['recommendations', userId, mood],
  queryFn: () => fetchRecommendations(userId, mood),
  retry: (failureCount, error) => {
    console.log('Query retry:', { failureCount, error })
    return failureCount < 3
  },
  onError: (error) => {
    console.error('Query failed:', error)
  }
})
```

### State Management Issues
**Symptoms**:
- Components not re-rendering
- State not persisting
- Unexpected state mutations

**Debugging Zustand Store**:
```typescript
// Add devtools to stores
import { devtools } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      login: (user) => {
        console.log('Auth store login:', user)
        set({ user }, false, 'login')
      },
      logout: () => {
        console.log('Auth store logout')
        set({ user: null }, false, 'logout')
      }
    }),
    { name: 'auth-store' }
  )
)
```

### Styling Problems
**Symptoms**:
- Tailwind classes not applying
- Component styles broken
- Responsive design issues

**Solutions**:
```bash
# 1. Verify Tailwind build
npm run build && grep -r "bg-blue-500" dist/

# 2. Check PostCSS configuration
cat postcss.config.js

# 3. Clear Tailwind cache
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# 4. Verify class names are in safelist (if using purging)
```

---

## 🔐 Authentication Problems

### Login/Registration Failures
**Symptoms**:
- Users can't log in with correct credentials
- Registration creates user but login fails
- Session expires immediately

**Debugging Steps**:
```typescript
// Add detailed auth logging
export async function loginUser(email: string, password: string) {
  console.log('Login attempt:', { email, timestamp: new Date().toISOString() })
  
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      console.log('User not found:', email)
      throw new Error('Invalid credentials')
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    console.log('Password validation:', { email, isValid: isValidPassword })
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }
    
    // Update last login
    await updateLastLogin(user.id)
    console.log('Login successful:', { userId: user.id, email })
    
    return user
  } catch (error) {
    console.error('Login failed:', { email, error: error.message })
    throw error
  }
}
```

### Session Management Issues
**Solutions**:
```typescript
// Verify session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: new MemoryStore() // Consider Redis for production
}))
```

---

## ⚡ Performance Issues

### Slow Page Loads
**Diagnosis**:
```javascript
// Add performance monitoring
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0]
  console.log('Page load performance:', {
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
    firstByte: perfData.responseStart - perfData.requestStart
  })
})
```

**Solutions**:
1. **Code Splitting**: Implement route-based code splitting
2. **Image Optimization**: Add lazy loading for images
3. **Bundle Analysis**: Use webpack-bundle-analyzer
4. **Caching**: Implement service worker caching

### Memory Leaks
**Symptoms**:
- Browser becomes sluggish over time
- High memory usage in DevTools
- React warnings about memory leaks

**Solutions**:
```typescript
// Fix useEffect cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Some periodic task
  }, 1000)
  
  // ✅ Always cleanup
  return () => clearInterval(interval)
}, [])

// Fix event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

---

## 🚀 Deployment Problems

### Vercel Build Failures
**Common Issues**:
1. Environment variables not set
2. Build script failures
3. Function timeout errors

**Solutions**:
```bash
# 1. Test build locally
npm run build
npm run preview

# 2. Check Vercel logs
vercel logs --follow

# 3. Verify environment variables
vercel env ls

# 4. Debug build script
VERCEL=1 npm run build
```

### Replit Environment Issues
**Solutions**:
```bash
# 1. Clear package cache
rm -rf node_modules package-lock.json
npm install

# 2. Check environment secrets
echo $DATABASE_URL | head -c 20

# 3. Restart Replit workspace
# Use Replit shell: kill -9 -1

# 4. Check port binding
netstat -tulpn | grep :5000
```

---

## 🔧 Emergency Fixes

### Quick Recovery Steps
1. **Database Recovery**:
   ```bash
   # Backup current data
   pg_dump $DATABASE_URL > backup.sql
   
   # Reset schema
   npm run db:push --force
   
   # Restore data if needed
   psql $DATABASE_URL < backup.sql
   ```

2. **Cache Clear**:
   ```bash
   # Clear all caches
   rm -rf node_modules/.cache
   rm -rf dist
   rm -rf .vite
   npm run build
   ```

3. **Environment Reset**:
   ```bash
   # Reset environment
   cp .env.example .env
   # Update with correct values
   # Restart services
   ```

### Health Check Endpoints
```typescript
// Add health checks for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  })
})

app.get('/api/health/db', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`)
    res.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message })
  }
})
```

---

*Keep this guide updated as new issues are discovered and resolved.*