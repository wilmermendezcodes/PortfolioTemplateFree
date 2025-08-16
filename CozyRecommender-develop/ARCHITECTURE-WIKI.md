# Cozy - AI-Powered Recommendation Platform
## Comprehensive Architecture & Development Wiki

### 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Layer](#database-layer)
5. [API Structure](#api-structure)
6. [Configuration Files](#configuration-files)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Implementation](#security-implementation)
9. [Future Improvements](#future-improvements)
10. [Debugging Guide](#debugging-guide)
11. [Common Issues & Solutions](#common-issues--solutions)

---

## 🏗️ System Overview

**Cozy** is a full-stack TypeScript application that provides mood-based recommendations for movies, books, and music. The platform features a React frontend with Express.js backend, using PostgreSQL for persistence and supporting both development (Replit) and production (Vercel) environments.

### Key Technologies
- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js + TypeScript, Node.js 20
- **Database**: PostgreSQL (Supabase), Drizzle ORM
- **State Management**: Zustand, TanStack Query
- **Routing**: Wouter (client-side)
- **Authentication**: Custom email-based system
- **Deployment**: Vercel (production), Replit (development)

---

## 🎨 Frontend Architecture

### Directory Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── RecommendationCard.tsx    # Individual recommendation display
│   │   ├── RecommendationGrid.tsx    # Grid layout for recommendations
│   │   ├── MoodSelector.tsx          # Mood selection interface
│   │   ├── Navigation.tsx            # App navigation
│   │   └── SEOHead.tsx              # SEO meta tags component
│   ├── pages/            # Route components
│   │   ├── Dashboard.tsx             # Main recommendations page
│   │   ├── Login.tsx                 # Authentication page
│   │   ├── Landing.tsx               # Marketing landing page
│   │   ├── Profile.tsx               # User profile management
│   │   └── NotFound.tsx              # 404 error page
│   ├── lib/              # Utilities and configuration
│   │   ├── queryClient.ts            # TanStack Query setup
│   │   ├── utils.ts                  # General utilities
│   │   └── auth.ts                   # Authentication helpers
│   ├── store/            # State management
│   │   ├── auth.ts                   # Authentication state (Zustand)
│   │   ├── recommendations.ts        # Recommendation state
│   │   └── theme.ts                  # Theme management
│   ├── hooks/            # Custom React hooks
│   │   ├── use-toast.ts              # Toast notification hook
│   │   └── use-auth.ts               # Authentication hook
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and Tailwind imports
```

### Key Frontend Files

#### Core Components
- **`App.tsx`**: Main router setup with Wouter, defines all application routes
- **`Dashboard.tsx`**: Primary user interface showing mood-based recommendations
- **`RecommendationGrid.tsx`**: Displays recommendations in responsive grid layout
- **`RecommendationCard.tsx`**: Individual recommendation with metadata and interactions
- **`MoodSelector.tsx`**: Mood selection interface (relaxed, energetic, creative)

#### State Management
- **`store/auth.ts`**: User authentication state using Zustand
- **`store/recommendations.ts`**: Recommendation data and mood state
- **`lib/queryClient.ts`**: TanStack Query configuration for API calls

#### Styling System
- **`index.css`**: Global styles, CSS variables, dark mode support
- **`tailwind.config.ts`**: Tailwind CSS configuration with custom design tokens
- **`components/ui/`**: shadcn/ui component library for consistent UI

---

## 🔧 Backend Architecture

### Directory Structure
```
server/
├── routes/               # API route handlers
│   ├── auth.ts          # Authentication endpoints
│   ├── recommendations.ts # Recommendation endpoints
│   ├── users.ts         # User management
│   ├── activities.ts    # User activity tracking
│   └── favorites.ts     # Favorites management
├── services/            # External API integrations
│   ├── omdb.ts         # Movie data service (Lorem ipsum)
│   ├── openlibrary.ts  # Book data service (Lorem ipsum)
│   └── musicbrainz.ts  # Music data service (Lorem ipsum)
├── middleware/          # Express middleware
│   ├── auth.ts         # Authentication middleware
│   ├── cors.ts         # CORS configuration
│   ├── security.ts     # Security headers and validation
│   └── rateLimit.ts    # Rate limiting
├── utils/              # Server utilities
│   ├── logger.ts       # Logging system
│   ├── validation.ts   # Input validation helpers
│   └── security.ts     # Security utilities
├── storage.ts          # Database abstraction layer
├── index.ts            # Server entry point
└── vite.ts             # Vite integration for development
```

### Key Backend Files

#### Core Server Files
- **`index.ts`**: Express server setup, middleware configuration, route mounting
- **`storage.ts`**: Database abstraction layer with Drizzle ORM integration
- **`vite.ts`**: Vite development server integration

#### API Routes
- **`routes/auth.ts`**: Login/register, session management
- **`routes/recommendations.ts`**: Mood-based recommendation endpoints
- **`routes/users.ts`**: User profile management
- **`routes/activities.ts`**: User activity tracking and analytics
- **`routes/favorites.ts`**: Favorite recommendations management

#### Services (Data Sources)
- **`services/omdb.ts`**: Movie recommendations with Lorem ipsum content
- **`services/openlibrary.ts`**: Book recommendations with Lorem ipsum content
- **`services/musicbrainz.ts`**: Music recommendations with Lorem ipsum content

---

## 🗄️ Database Layer

### Schema Files
```
shared/
├── schema.ts            # Drizzle schema definitions
└── types.ts             # Shared TypeScript types
```

### Database Tables

#### Users Table
```typescript
// Core user information
users: {
  id: uuid (primary key)
  email: varchar(255) unique
  username: varchar(100) unique  
  passwordHash: varchar(255)
  createdAt: timestamp
  lastLoginAt: timestamp
  preferences: jsonb
  location: varchar(100)
  subscriptionTier: varchar(50)
}
```

#### Recommendations Table
```typescript
// Generated recommendations cache
recommendations: {
  id: uuid (primary key)
  userId: uuid (foreign key -> users.id)
  mood: varchar(50)
  type: varchar(50) // 'movie', 'book', 'music'
  title: varchar(255)
  description: text
  imageUrl: varchar(500)
  metadata: jsonb
  createdAt: timestamp
  expiresAt: timestamp
}
```

#### Favorites Table
```typescript
// User's saved recommendations
favorites: {
  id: uuid (primary key)
  userId: uuid (foreign key -> users.id)
  recommendationId: uuid (foreign key -> recommendations.id)
  createdAt: timestamp
}
```

#### Activities Table
```typescript
// User interaction tracking
activities: {
  id: uuid (primary key)
  userId: uuid (foreign key -> users.id)
  action: varchar(100) // 'view', 'favorite', 'share'
  resourceType: varchar(50)
  resourceId: uuid
  metadata: jsonb
  createdAt: timestamp
}
```

### Database Configuration
- **`drizzle.config.ts`**: Drizzle ORM configuration
- **Connection**: Uses DATABASE_URL environment variable (Supabase)
- **Migrations**: Schema changes pushed with `npm run db:push`

---

## 🛠️ API Structure

### Authentication Endpoints
```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
POST /api/auth/logout    # User logout
GET  /api/auth/me        # Get current user
```

### Recommendation Endpoints
```
GET  /api/recommendations/:userId  # Get recommendations by mood
POST /api/recommendations/generate # Generate new recommendations
GET  /api/recommendations/history  # User recommendation history
```

### User Management
```
GET    /api/users/:id      # Get user profile
PUT    /api/users/:id      # Update user profile
DELETE /api/users/:id      # Delete user account
```

### Favorites & Activities
```
GET    /api/favorites/:userId     # Get user favorites
POST   /api/favorites             # Add to favorites
DELETE /api/favorites/:id         # Remove from favorites
GET    /api/activities/:userId    # Get user activities
POST   /api/activities            # Log user activity
```

### Vercel Serverless Functions
```
api/
├── index.js             # Main API handler for Vercel deployment
└── [Additional serverless functions as needed]
```

---

## ⚙️ Configuration Files

### Build & Development
- **`package.json`**: Dependencies, scripts, project metadata
- **`tsconfig.json`**: TypeScript compiler configuration
- **`vite.config.ts`**: Vite bundler configuration (development)
- **`vite.config.vercel.ts`**: Vite configuration for Vercel deployment

### Styling & UI
- **`tailwind.config.ts`**: Tailwind CSS configuration, custom theme
- **`postcss.config.js`**: PostCSS plugins configuration
- **`components.json`**: shadcn/ui components configuration

### Deployment
- **`vercel.json`**: Vercel deployment configuration
- **`.replit`**: Replit environment configuration
- **`.gitignore`**: Git ignore patterns
- **`.vercelignore`**: Vercel deployment ignore patterns

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# External APIs (currently not used due to Lorem ipsum content)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

# Security
NODE_ENV=development|production
```

---

## 🚀 Deployment Architecture

### Development Environment (Replit)
- **Server**: Express.js with Vite middleware
- **Database**: Supabase PostgreSQL
- **Port**: 5000 (serves both frontend and backend)
- **Build**: Development build with HMR

### Production Environment (Vercel)
- **Frontend**: Static site generated by Vite
- **API**: Vercel serverless functions
- **Database**: Supabase PostgreSQL (same as development)
- **CDN**: React and dependencies loaded from CDN
- **Build**: Optimized production build

### Build Scripts
- **`npm run dev`**: Development server (Replit)
- **`npm run build`**: Production build
- **`npm run preview`**: Preview production build locally
- **`npm run db:push`**: Push schema changes to database

---

## 🔒 Security Implementation

### Authentication
- **Strategy**: Email-based authentication with password hashing
- **Session Management**: Server-side session storage
- **Password Security**: bcrypt hashing with salt

### API Security
- **CORS**: Configured for development and production origins
- **Rate Limiting**: Express rate limiter to prevent abuse
- **Input Validation**: Zod schemas for API request validation
- **Security Headers**: Helmet.js for security headers

### Data Protection
- **SQL Injection**: Prevented through Drizzle ORM parameterized queries
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data stored in environment variables

---

## 🔮 Future Improvements

### Performance Optimizations
1. **Caching Layer**
   - Redis for recommendation caching
   - Service worker for offline functionality
   - CDN caching for static assets

2. **Database Optimizations**
   - Database indexing on frequently queried columns
   - Connection pooling for better scalability
   - Read replicas for analytics queries

### Feature Enhancements
1. **Real API Integration**
   - Integrate TMDB API for authentic movie data
   - Google Books API for real book information
   - Spotify/Apple Music API for music recommendations

2. **Advanced Personalization**
   - Machine learning-based recommendation engine
   - User preference learning from interaction history
   - Collaborative filtering based on similar users

3. **Social Features**
   - User reviews and ratings
   - Social sharing of recommendations
   - Friend recommendations and social discovery

4. **Content Management**
   - Admin dashboard for content management
   - Content moderation and quality control
   - Analytics and reporting dashboard

### Technical Improvements
1. **Microservices Architecture**
   - Separate services for authentication, recommendations, and user management
   - Event-driven architecture with message queues
   - Container orchestration with Docker/Kubernetes

2. **Testing & Quality Assurance**
   - Unit tests with Jest/Vitest
   - Integration tests for API endpoints
   - End-to-end tests with Playwright
   - Code quality tools (ESLint, Prettier, SonarQube)

3. **Monitoring & Observability**
   - Application performance monitoring (APM)
   - Error tracking with Sentry
   - Logging aggregation with structured logs
   - Health checks and uptime monitoring

---

## 🐛 Debugging Guide

### Common Debug Locations

#### Frontend Issues
1. **Browser Developer Tools**
   - Console for JavaScript errors
   - Network tab for API call issues
   - Elements tab for styling problems

2. **React Query DevTools**
   - Query status and caching issues
   - Network request inspection
   - State management debugging

#### Backend Issues
1. **Server Console Logs**
   - Express server logs in terminal
   - Database connection errors
   - API endpoint request/response logging

2. **Database Debugging**
   - Drizzle query logging
   - PostgreSQL logs in Supabase dashboard
   - Schema validation errors

### Debug Tools & Commands

#### Development Commands
```bash
# Start with verbose logging
NODE_ENV=development npm run dev

# Database schema inspection
npm run db:push --verbose

# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? 'DB Connected' : 'No DB')"
```

#### Production Debugging
```bash
# Vercel function logs
vercel logs

# Build debugging
npm run build 2>&1 | tee build.log

# Database connection test
npm run db:test
```

---

## ⚠️ Common Issues & Solutions

### 1. Database Connection Issues
**Problem**: "Failed to connect to PostgreSQL database"
**Solutions**:
- Verify DATABASE_URL environment variable
- Check Supabase project status
- Ensure database tables are created
- Test connection with database client

### 2. API Request Failures
**Problem**: 500 Internal Server Error on API calls
**Solutions**:
- Check server console logs
- Verify request payload with Zod validation
- Test database queries separately
- Check authentication middleware

### 3. Build Failures
**Problem**: Vite build fails or Vercel deployment errors
**Solutions**:
- Check TypeScript compilation errors
- Verify all imports and dependencies
- Clear node_modules and reinstall
- Check environment variables in deployment

### 4. CORS Issues
**Problem**: "CORS policy blocked the request"
**Solutions**:
- Verify CORS middleware configuration
- Check allowed origins in production
- Test with different browsers
- Ensure proper preflight handling

### 5. Authentication Problems
**Problem**: Users can't login or session expires
**Solutions**:
- Check password hashing and comparison
- Verify session storage configuration
- Test authentication middleware
- Check cookie settings and HTTPS requirements

### 6. Styling Issues
**Problem**: Tailwind classes not working or UI components broken
**Solutions**:
- Verify Tailwind CSS compilation
- Check PostCSS configuration
- Ensure shadcn/ui components are properly imported
- Test responsive design at different breakpoints

---

## 📚 Additional Resources

### Documentation Links
- [Replit Project Documentation](./replit.md)
- [Local Development Setup](./LOCAL-SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Supabase Configuration](./supabase-config.md)

### External Documentation
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [Supabase Database](https://supabase.com/docs)

---

*Last Updated: August 11, 2025*
*Version: 2.0.0*
*Architecture Status: Production Ready*