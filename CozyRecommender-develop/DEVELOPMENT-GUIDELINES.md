# Development Guidelines & Best Practices
## Code-Based Development Guide for Cozy Recommendation Platform

### 📋 Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Code Standards & Conventions](#code-standards--conventions)
3. [Component Development](#component-development)
4. [API Development](#api-development)
5. [Database Development](#database-development)
6. [Testing Strategy](#testing-strategy)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Best Practices](#security-best-practices)
9. [Git Workflow](#git-workflow)
10. [Code Review Checklist](#code-review-checklist)

---

## 🔧 Development Environment Setup

### Prerequisites
```bash
# Node.js 20+
node --version  # Should be v20.x.x

# Package manager
npm --version   # Should be 10+

# Database access
# Ensure Supabase credentials are configured
```

### Local Development Setup
```bash
# Clone repository
git clone [repository-url]
cd cozy-recommendations

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Configure DATABASE_URL and other secrets

# Database setup
npm run db:push

# Start development server
npm run dev
```

### Development Tools
- **Code Editor**: VSCode with TypeScript, Tailwind CSS, and React extensions
- **Database Client**: Supabase Dashboard or pgAdmin
- **API Testing**: Thunder Client, Postman, or built-in fetch
- **Version Control**: Git with conventional commits

---

## 📏 Code Standards & Conventions

### TypeScript Standards
```typescript
// ✅ Good: Explicit types, descriptive names
interface UserPreferences {
  favoriteGenres: string[]
  preferredMoods: MoodType[]
  contentTypes: ContentType[]
}

// ❌ Avoid: Any types, unclear names
interface Prefs {
  data: any
  stuff: any[]
}
```

### File Naming Conventions
```
# Components: PascalCase
components/RecommendationCard.tsx
components/ui/Button.tsx

# Utilities/Services: camelCase
utils/formatDate.ts
services/recommendationService.ts

# Constants: SCREAMING_SNAKE_CASE
constants/API_ENDPOINTS.ts
constants/DEFAULT_MOODS.ts

# Types: PascalCase with descriptive suffix
types/UserTypes.ts
types/RecommendationTypes.ts
```

### Import Organization
```typescript
// 1. Node modules
import React from 'react'
import { useState, useEffect } from 'react'

// 2. Internal modules
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 3. Relative imports
import './Component.css'
```

### Code Formatting
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Trailing Commas**: Always use in multiline structures
- **Line Length**: Maximum 80 characters

---

## ⚛️ Component Development

### React Component Structure
```typescript
// ComponentName.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentNameProps {
  title: string
  onAction?: () => void
  variant?: 'primary' | 'secondary'
}

export function ComponentName({ 
  title, 
  onAction, 
  variant = 'primary' 
}: ComponentNameProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Effect logic here
  }, [])

  const handleAction = async () => {
    setIsLoading(true)
    try {
      await onAction?.()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="component-wrapper">
      <h2>{title}</h2>
      <Button 
        variant={variant}
        onClick={handleAction}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Action'}
      </Button>
    </div>
  )
}
```

### Component Best Practices
1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Values**: Use default parameters for optional props
4. **Error Boundaries**: Wrap components that might fail
5. **Accessibility**: Include proper ARIA labels and semantic HTML

### Custom Hooks Pattern
```typescript
// hooks/useRecommendations.ts
import { useQuery } from '@tanstack/react-query'
import { recommendationService } from '@/services/recommendations'

export function useRecommendations(userId: string, mood: string) {
  return useQuery({
    queryKey: ['recommendations', userId, mood],
    queryFn: () => recommendationService.getByMood(userId, mood),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}
```

---

## 🛠️ API Development

### Express Route Structure
```typescript
// routes/recommendations.ts
import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'

const router = Router()

// Request/Response schemas
const GetRecommendationsSchema = z.object({
  mood: z.enum(['relaxed', 'energetic', 'creative']),
  limit: z.number().min(1).max(50).optional().default(6),
})

// Route handler
router.get('/:userId', 
  authMiddleware,
  validateRequest(GetRecommendationsSchema),
  async (req, res) => {
    try {
      const { userId } = req.params
      const { mood, limit } = req.query

      const recommendations = await recommendationService.getByMood(
        userId, 
        mood, 
        limit
      )

      res.json({
        success: true,
        data: recommendations,
        meta: {
          count: recommendations.length,
          mood,
          timestamp: new Date().toISOString(),
        }
      })
    } catch (error) {
      logger.error('Get recommendations failed:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recommendations',
      })
    }
  }
)

export default router
```

### API Response Standards
```typescript
// ✅ Consistent API response format
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    count?: number
    page?: number
    total?: number
    timestamp: string
  }
}

// Success response
{
  "success": true,
  "data": [...],
  "meta": {
    "count": 6,
    "timestamp": "2025-08-11T15:30:00.000Z"
  }
}

// Error response
{
  "success": false,
  "error": "Validation failed: mood is required",
  "meta": {
    "timestamp": "2025-08-11T15:30:00.000Z"
  }
}
```

### Service Layer Pattern
```typescript
// services/recommendationService.ts
import { db } from '@/server/storage'
import { recommendations, users } from '@/shared/schema'

class RecommendationService {
  async getByMood(userId: string, mood: string, limit = 6) {
    const results = await db
      .select()
      .from(recommendations)
      .where(
        and(
          eq(recommendations.userId, userId),
          eq(recommendations.mood, mood)
        )
      )
      .limit(limit)
      .orderBy(desc(recommendations.createdAt))

    return results
  }

  async create(data: CreateRecommendationData) {
    const [result] = await db
      .insert(recommendations)
      .values(data)
      .returning()
    
    return result
  }

  async delete(id: string, userId: string) {
    await db
      .delete(recommendations)
      .where(
        and(
          eq(recommendations.id, id),
          eq(recommendations.userId, userId)
        )
      )
  }
}

export const recommendationService = new RecommendationService()
```

---

## 🗄️ Database Development

### Schema Design Principles
1. **Normalization**: Follow 3NF (Third Normal Form)
2. **Indexing**: Add indexes on frequently queried columns
3. **Constraints**: Use foreign keys and check constraints
4. **Data Types**: Choose appropriate PostgreSQL data types

### Drizzle Schema Best Practices
```typescript
// shared/schema.ts
import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Table definition
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  preferences: jsonb('preferences').$type<UserPreferences>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  recommendations: many(recommendations),
  favorites: many(favorites),
  activities: many(activities),
}))

// Type inference
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### Migration Strategy
```typescript
// Use npm run db:push for schema changes
// For data migrations, create migration scripts:

// migrations/001_add_user_preferences.sql
ALTER TABLE users ADD COLUMN preferences JSONB;
UPDATE users SET preferences = '{}' WHERE preferences IS NULL;
```

### Query Optimization
```typescript
// ✅ Good: Use indexes, limit results, specific columns
const recentRecommendations = await db
  .select({
    id: recommendations.id,
    title: recommendations.title,
    createdAt: recommendations.createdAt,
  })
  .from(recommendations)
  .where(eq(recommendations.userId, userId))
  .orderBy(desc(recommendations.createdAt))
  .limit(20)

// ❌ Avoid: Select all, no limits, no indexes
const allData = await db.select().from(recommendations)
```

---

## 🧪 Testing Strategy

### Unit Testing (Future Implementation)
```typescript
// __tests__/components/RecommendationCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { RecommendationCard } from '../RecommendationCard'

describe('RecommendationCard', () => {
  const mockRecommendation = {
    id: '1',
    title: 'Test Movie',
    description: 'Test Description',
    imageUrl: null,
    metadata: { year: 2023, genre: 'Comedy' }
  }

  it('renders recommendation title', () => {
    render(<RecommendationCard recommendation={mockRecommendation} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('handles favorite click', () => {
    const onFavorite = jest.fn()
    render(
      <RecommendationCard 
        recommendation={mockRecommendation} 
        onFavorite={onFavorite}
      />
    )
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }))
    expect(onFavorite).toHaveBeenCalledWith(mockRecommendation.id)
  })
})
```

### Integration Testing
```typescript
// __tests__/api/recommendations.test.ts
import request from 'supertest'
import { app } from '../server'

describe('/api/recommendations', () => {
  it('should get recommendations by mood', async () => {
    const response = await request(app)
      .get('/api/recommendations/user-123?mood=relaxed')
      .expect(200)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toBeDefined()
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})
```

### Test Configuration
```json
// jest.config.js
{
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
  "moduleNameMapping": {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
}
```

---

## ⚡ Performance Guidelines

### Frontend Performance
1. **Code Splitting**: Use React.lazy for route-based splitting
2. **Memoization**: Use React.memo, useMemo, useCallback appropriately
3. **Bundle Analysis**: Regular bundle size monitoring
4. **Image Optimization**: Use next/image equivalent or lazy loading

```typescript
// Code splitting example
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
      </Router>
    </Suspense>
  )
}
```

### Backend Performance
1. **Database Connection Pooling**
2. **Query Optimization**
3. **Caching Strategy**
4. **Rate Limiting**

```typescript
// Connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Caching example
const cache = new Map()

export async function getCachedRecommendations(key: string) {
  if (cache.has(key)) {
    return cache.get(key)
  }
  
  const data = await fetchRecommendations(key)
  cache.set(key, data)
  setTimeout(() => cache.delete(key), 5 * 60 * 1000) // 5 min TTL
  
  return data
}
```

---

## 🔒 Security Best Practices

### Input Validation
```typescript
// Always validate input with Zod
const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
})
```

### Authentication & Authorization
```typescript
// JWT token validation middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Data Sanitization
```typescript
// Sanitize user input
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input)
}
```

---

## 🔄 Git Workflow

### Conventional Commits
```bash
# Format: type(scope): description
feat(auth): add OAuth login functionality
fix(api): resolve recommendation caching issue
docs(wiki): update development guidelines
style(ui): improve button hover states
refactor(db): optimize recommendation queries
test(api): add integration tests for users endpoint
```

### Branch Strategy
```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features

# Feature branches
feature/user-profiles
feature/social-sharing
bugfix/recommendation-loading
hotfix/security-patch
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
```

---

## ✅ Code Review Checklist

### General Code Quality
- [ ] Code follows TypeScript and project conventions
- [ ] Functions and variables have descriptive names
- [ ] Complex logic is commented and documented
- [ ] No console.log statements in production code
- [ ] Error handling is implemented properly

### React Components
- [ ] Components have proper TypeScript interfaces
- [ ] Props are validated and have default values
- [ ] Accessibility attributes are included
- [ ] Component is properly tested or testable
- [ ] No memory leaks (useEffect cleanup)

### API Development
- [ ] Input validation with Zod schemas
- [ ] Proper error handling and logging
- [ ] Authentication/authorization checks
- [ ] Rate limiting where appropriate
- [ ] Consistent API response format

### Database Changes
- [ ] Schema changes are backwards compatible
- [ ] Migrations are tested
- [ ] Indexes are added for query performance
- [ ] Foreign key constraints are proper

### Security Review
- [ ] No sensitive data in client-side code
- [ ] Input sanitization is implemented
- [ ] Authentication is required for protected routes
- [ ] SQL injection prevention (using ORM)
- [ ] XSS protection measures

### Performance
- [ ] No unnecessary re-renders in React
- [ ] Database queries are optimized
- [ ] Bundle size impact is considered
- [ ] Caching strategy is appropriate

---

*This development guide should be updated as the project evolves and new patterns emerge.*