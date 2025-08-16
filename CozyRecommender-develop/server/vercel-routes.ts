// Simplified routes for Vercel deployment
import type { Express } from "express";
import { getStorage } from "./storage";
import { insertUserSchema, insertRecommendationSchema, insertFavoriteSchema, insertActivitySchema } from "@shared/schema";
import { fetchMoviesByMood } from "./services/omdb";
import { fetchBooksByMood } from "./services/openlibrary";
import { fetchMusicByMood } from "./services/musicbrainz";
import { securityMiddleware, logSecurityEvent } from "./middleware/security";

export async function registerVercelRoutes(app: Express): Promise<void> {
  // Initialize storage
  await import('./storage');

  // Auth routes
  app.post("/api/auth/login", 
    securityMiddleware.rateLimit.auth,
    securityMiddleware.validation.user,
    async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      let user = await getStorage().getUserByUsername(username);
      
      if (!user) {
        const newUser = {
          username,
          preferences: {},
          subscription: "free"
        };
        
        const validatedUser = insertUserSchema.parse(newUser);
        user = await getStorage().createUser(validatedUser);
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Recommendations routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const { mood, type, refresh } = req.query;
      const userId = req.params.userId;

      // Get existing recommendations if not refreshing
      if (!refresh) {
        const existing = await getStorage().getRecommendations(userId, {
          mood: mood as string,
          type: type as string
        });
        if (existing.length > 0) {
          return res.json(existing);
        }
      }

      // Generate new recommendations
      let recommendations: any[] = [];
      
      if (!type || type === 'movie') {
        const movies = await fetchMoviesByMood(mood as string || 'relaxed');
        recommendations.push(...movies.map(movie => ({
          ...movie,
          type: 'movie' as const,
          userId
        })));
      }

      if (!type || type === 'book') {
        const books = await fetchBooksByMood(mood as string || 'relaxed');
        recommendations.push(...books.map(book => ({
          ...book,
          type: 'book' as const,
          userId
        })));
      }

      if (!type || type === 'music') {
        const music = await fetchMusicByMood(mood as string || 'relaxed');
        recommendations.push(...music.map(track => ({
          ...track,
          type: 'music' as const,
          userId
        })));
      }

      // Save recommendations
      for (const rec of recommendations) {
        try {
          const validatedRec = insertRecommendationSchema.parse(rec);
          await getStorage().createRecommendation(validatedRec);
        } catch (error) {
          console.error('Failed to save recommendation:', error);
        }
      }

      res.json(recommendations);
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await getStorage().getFavorites(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to get favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedFavorite = insertFavoriteSchema.parse(req.body);
      const favorite = await getStorage().createFavorite(validatedFavorite);
      
      await getStorage().createActivity({
        userId: validatedFavorite.userId,
        action: "favorite",
        title: "Added item to favorites"
      });
      
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Failed to add favorite" });
    }
  });

  // Activities routes
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await getStorage().getActivities(req.params.userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activities" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
}