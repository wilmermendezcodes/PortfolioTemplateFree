# Overview

Cozy is an AI-powered recommendation platform that provides personalized suggestions for movies, books, and music based on user mood and preferences. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Drizzle ORM for database management. The platform focuses on mood-based recommendations, allowing users to discover content that matches their current emotional state.

## Recent Updates (August 2025)
- ✅ **SUCCESSFUL VERCEL DEPLOYMENT**: Application successfully deployed to Vercel with custom build system
- ✅ **Custom Build Pipeline**: Implemented robust build system with esbuild detection and automatic fallback
- ✅ **Static Site Generation**: Created production-ready HTML with CDN-based React and Tailwind CSS
- ✅ **Serverless API Functions**: Deployed working API endpoints for Vercel's serverless environment
- ✅ **Supabase Database Integration**: Connected to Supabase database with proper configuration
- ✅ **Build Issue Resolution**: Solved Vite path resolution and esbuild availability issues through custom build scripts
- ✅ **Production Deployment**: Live application running on Vercel's global edge network
- ✅ **API Content Fix**: Resolved recommendation content display by fixing data format mismatch between local and Vercel APIs
- ✅ **Enhanced Vercel API**: Updated serverless functions to return proper metadata with type, mood, cast, genre, and author information
- ✅ **Build Path Correction**: Fixed Vercel build script to use correct output directory matching Vite configuration
- ✅ **Lorem Ipsum Placeholder Content**: Replaced all content with Lorem ipsum text to ensure zero copyright risk
- ✅ **No Images**: Removed all images including custom SVG graphics, using simple text placeholders instead
- ✅ **Expandable Card Interface**: Implemented collapsible cards with detailed metadata views using Lorem ipsum content
- ✅ **Placeholder Enhancement**: Added Lorem ipsum reviews, ratings, and theme tags for complete placeholder experience
- ✅ **Maximum Copyright Safety**: All content is now Lorem ipsum placeholder text with no external dependencies
- ✅ **Landing Page**: Created professional landing page for unauthenticated users showcasing features
- ✅ **Project Structure**: Confirmed single-project approach is optimal for this use case
- ✅ **Comprehensive SEO Optimization**: Implemented comprehensive search engine optimization across all pages
  - Dynamic SEO component (SEOHead.tsx) with meta tags, Open Graph, and Twitter Cards
  - JSON-LD structured data for better search engine understanding
  - Unique titles, descriptions, and keywords for each page
  - Proper 404 NotFound page with SEO optimization
  - Robots.txt and sitemap.xml for search engine crawling
  - Breadcrumb navigation structured data
- ✅ **Search-Focused SEO Enhancement**: Enhanced SEO specifically for movie, book, and music searches
  - Content-type specific keywords and meta tags
  - Search action structured data for movie, book, and music queries
  - Enhanced sitemap with content-type specific URLs
  - Search engine optimized titles and descriptions
  - Advanced robots.txt with search engine specific instructions
  - SearchAction schema markup for better search result integration
- ✅ **Complete Lorem Ipsum Content Replacement**: Replaced ALL real content with Lorem ipsum placeholder text
  - Updated Vercel API (api/index.js) to use Lorem ipsum for all recommendations
  - Modified local server services (omdb.ts, openlibrary.ts, musicbrainz.ts) to bypass API calls and return Lorem ipsum content
  - Replaced all images with null imageUrl values to use placeholder text instead
  - Ensured zero copyright risk by eliminating all real movie, book, and music content
  - Maintained full functionality and metadata structure with placeholder data
- ✅ **Comprehensive Documentation Suite**: Created complete technical documentation for code-based development
  - ARCHITECTURE-WIKI.md: Full system architecture, component structure, and technical overview
  - DEVELOPMENT-GUIDELINES.md: Code standards, best practices, and development workflow
  - TROUBLESHOOTING-GUIDE.md: Issue resolution, debugging procedures, and emergency fixes
  - Complete file mappings for frontend, backend, database, and API structure
  - Future improvement recommendations and debugging strategies

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global state management (auth, recommendations)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming support
- **Data Fetching**: TanStack Query (React Query) for server state management and caching

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints with structured route organization
- **Development**: Hot reload with Vite middleware integration for seamless full-stack development
- **Build Process**: esbuild for production bundling with external package handling

## Database Layer
- **Database**: PostgreSQL with Neon serverless integration (ACTIVE)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management
- **Schema Design**: Relational design with users, recommendations, favorites, and activities tables with proper relations
- **Storage Abstraction**: Interface-based storage layer with DatabaseStorage implementation using real PostgreSQL database
- **Migration Status**: Schema pushed to database with `npm run db:push` (August 2025)

## Authentication & Authorization
- **Authentication**: Simple email-based authentication system
- **Session Management**: Stateless approach with user data stored in localStorage
- **User Model**: Basic user profile with preferences, location, and subscription tiers

## Core Features
- **Mood-based Recommendations**: Users select emotional states (relaxed, energetic, creative, nostalgic) to receive tailored content suggestions
- **Official API Integration**: Uses legitimate APIs from TMDB (movies), Google Books (books), and YouTube (music) with fallback placeholders when API keys aren't configured
- **Multi-content Types**: Support for movies, books, and music recommendations with authentic content
- **Legal Content Embedding**: YouTube playlists can be embedded directly in the app following platform Terms of Service
- **Personalization**: User preferences and activity tracking for improved recommendations  
- **Favorites System**: Users can save and manage their favorite recommendations
- **Activity Logging**: Track user interactions for analytics and personalization

# External Dependencies

## Official API Integrations
- **TMDB (The Movie Database)**: Official movie database API for authentic movie data, posters, and ratings
- **Google Books API**: Official Google Books service for real book information and covers
- **YouTube Data API v3**: Official YouTube API for music playlist data and legal embedding
- **Fallback System**: Placeholder content when API keys aren't configured, ready for easy API integration

## UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting utilities

## State and Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **Zustand**: Lightweight state management for client-side state
- **React Hook Form**: Form handling with validation support

## Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Drizzle ORM**: Type-safe ORM with excellent TypeScript integration
- **Express.js**: Web application framework for Node.js
- **Zod**: Runtime type validation for API inputs and database schemas

## Development Tools
- **Vite**: Build tool with HMR and optimized development experience
- **TypeScript**: Static type checking and enhanced developer experience
- **ESLint/Prettier**: Code linting and formatting (implied by project structure)

## Hosting and Deployment
- **Replit**: Development and hosting environment with integrated tooling
- **Environment Variables**: DATABASE_URL for database connection, API keys for external services