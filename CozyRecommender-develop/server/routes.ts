import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertUserSchema, insertRecommendationSchema, insertFavoriteSchema, insertActivitySchema } from "@shared/schema";
import { fetchMoviesByMood } from "./services/omdb";
import { fetchBooksByMood } from "./services/openlibrary";
import { fetchMusicByMood } from "./services/musicbrainz";
import { securityMiddleware, logSecurityEvent } from "./middleware/security";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes with rate limiting and validation
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
        // Create new user for demo purposes
        const newUser = {
          username,
          preferences: {},
          subscription: "free"
        };
        
        const validatedUser = insertUserSchema.parse(newUser);
        user = await getStorage().createUser(validatedUser);
        
        // Log new user creation
        await logSecurityEvent('USER_REGISTERED', req, { userId: user.id, username });
      } else {
        // Log successful login
        await logSecurityEvent('USER_LOGIN', req, { userId: user.id, username });
      }

      res.json({ user });
    } catch (error: any) {
      await logSecurityEvent('LOGIN_FAILED', req, { username: req.body.username, error: error.message });
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes with API rate limiting
  app.get("/api/user/:id", 
    securityMiddleware.rateLimit.api,
    async (req, res) => {
    try {
      const user = await getStorage().getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const user = await getStorage().updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Recommendations routes - Generate fresh Lorem ipsum content
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const { type, mood } = req.query;
      
      // Generate real content from APIs
      if (type && mood) {
        let recommendations: any[] = [];

        // Fetch real recommendations from APIs based on type
        try {
          if (type === 'movie') {
            recommendations = await fetchMoviesByMood(mood as string);
          } else if (type === 'book') {
            recommendations = await fetchBooksByMood(mood as string);
          } else if (type === 'music') {
            recommendations = await fetchMusicByMood(mood as string);
          }
        } catch (error) {
          console.error(`Error fetching ${type} recommendations:`, error);
          return res.status(500).json({ message: "Failed to fetch recommendations from external APIs" });
        }

        // Add IDs and proper formatting
        const formattedRecommendations = recommendations.map((rec, index) => ({
          id: `${type}-${mood}-${index}`,
          ...rec,
          type,
          mood
        }));
        
        return res.json(formattedRecommendations);
      }
      
      // Fallback to stored data if no type/mood specified
      let recommendations;
      if (mood) {
        recommendations = await getStorage().getRecommendationsByMood(
          req.params.userId, 
          mood as string, 
          type as string
        );
      } else {
        recommendations = await getStorage().getRecommendations(req.params.userId, type as string);
      }
      
      res.json(recommendations);
    } catch (error) {
      console.error('Recommendation generation error:', error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Specific route for type-based recommendations that generates Lorem ipsum content
  app.get("/api/recommendations/:userId/:type", async (req, res) => {
    try {
      const { userId, type } = req.params;
      const { mood } = req.query;
      
      let recommendations: any[] = [];

      // Fetch real recommendations from APIs based on type
      try {
        if (type === 'movie') {
          recommendations = await fetchMoviesByMood(mood as string || 'relaxed');
        } else if (type === 'book') {
          recommendations = await fetchBooksByMood(mood as string || 'relaxed');
        } else if (type === 'music') {
          recommendations = await fetchMusicByMood(mood as string || 'relaxed');
        }
      } catch (error) {
        console.error(`Error fetching ${type} recommendations:`, error);
        return res.status(500).json({ message: "Failed to fetch recommendations from external APIs" });
      }

      // Add IDs and proper formatting
      const formattedRecommendations = recommendations.map((rec, index) => ({
        id: `${type}-${mood || 'relaxed'}-${index}`,
        ...rec,
        type,
        mood: mood || 'relaxed'
      }));
      
      res.json(formattedRecommendations);
    } catch (error) {
      console.error('Recommendation generation error:', error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const validatedRecommendation = insertRecommendationSchema.parse(req.body);
      const recommendation = await getStorage().createRecommendation(validatedRecommendation);
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ message: "Failed to create recommendation" });
    }
  });

  // AI recommendations with original content
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { userId, mood, type } = req.body;
      
      let recommendations: any[] = [];

      try {
        if (type === 'movie') {
          recommendations = await fetchMoviesByMood(mood);
        } else if (type === 'book') {
          recommendations = await fetchBooksByMood(mood);
        } else if (type === 'music') {
          recommendations = await fetchMusicByMood(mood);
        }
      } catch (error) {
        console.error(`Error fetching ${type} recommendations:`, error);
        return res.status(500).json({ message: "Failed to fetch AI recommendations from external APIs" });
      }

      // Store recommendations in our storage
      const storedRecommendations = [];
      for (const rec of recommendations) {
        const recommendation = {
          userId,
          type: type || 'movie',
          title: rec.title,
          description: rec.description,
          imageUrl: rec.imageUrl,
          mood,
          metadata: rec.metadata || {}
        };
        
        const stored = await getStorage().createRecommendation(recommendation);
        storedRecommendations.push(stored);
      }

      res.json(storedRecommendations);
    } catch (error) {
      console.error('API recommendation error:', error);
      res.status(500).json({ message: "Failed to fetch recommendations from official APIs" });
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
      
      // Create activity
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

  app.delete("/api/favorites/:userId/:recommendationId", async (req, res) => {
    try {
      const removed = await getStorage().removeFavorite(req.params.userId, req.params.recommendationId);
      if (removed) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
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

  const httpServer = createServer(app);
  return httpServer;
}
