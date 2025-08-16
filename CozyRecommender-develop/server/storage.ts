import { 
  users,
  recommendations,
  favorites,
  activities,
  type User, 
  type InsertUser,
  type Recommendation,
  type InsertRecommendation,
  type Favorite,
  type InsertFavorite,
  type Activity,
  type InsertActivity
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getRecommendations(userId: string, type?: string): Promise<Recommendation[]>;
  getRecommendationsByMood(userId: string, mood: string, type?: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  getFavorites(userId: string): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, recommendationId: string): Promise<boolean>;
  
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private favorites: Map<string, Favorite> = new Map();
  private activities: Map<string, Activity> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      preferences: insertUser.preferences || {},
      subscription: insertUser.subscription || "free"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getRecommendations(userId: string, type?: string): Promise<Recommendation[]> {
    const userRecs = Array.from(this.recommendations.values())
      .filter(rec => rec.userId === userId);
    
    if (type) {
      return userRecs.filter(rec => rec.type === type);
    }
    
    return userRecs;
  }

  async getRecommendationsByMood(userId: string, mood: string, type?: string): Promise<Recommendation[]> {
    const userRecs = Array.from(this.recommendations.values())
      .filter(rec => rec.userId === userId && rec.mood === mood);
    
    if (type) {
      return userRecs.filter(rec => rec.type === type);
    }
    
    return userRecs;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const recommendation: Recommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date(),
      metadata: insertRecommendation.metadata || {},
      description: insertRecommendation.description || null,
      imageUrl: insertRecommendation.imageUrl || null,
      mood: insertRecommendation.mood || null
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date()
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, recommendationId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values())
      .find(fav => fav.userId === userId && fav.recommendationId === recommendationId);
    
    if (favorite) {
      this.favorites.delete(favorite.id);
      return true;
    }
    return false;
  }

  async getActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getRecommendations(userId: string, type?: string): Promise<Recommendation[]> {
    if (type) {
      return await db
        .select()
        .from(recommendations)
        .where(and(eq(recommendations.userId, userId), eq(recommendations.type, type)))
        .orderBy(desc(recommendations.createdAt));
    }
    
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, userId))
      .orderBy(desc(recommendations.createdAt));
  }

  async getRecommendationsByMood(userId: string, mood: string, type?: string): Promise<Recommendation[]> {
    let whereConditions = and(eq(recommendations.userId, userId), eq(recommendations.mood, mood));
    
    if (type) {
      whereConditions = and(whereConditions, eq(recommendations.type, type));
    }
    
    return await db
      .select()
      .from(recommendations)
      .where(whereConditions)
      .orderBy(desc(recommendations.createdAt));
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(recommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(insertFavorite)
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, recommendationId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.recommendationId, recommendationId)));
      
      // Check if any rows were affected (different return types for different drivers)
      return Array.isArray(result) ? result.length > 0 : (result as any).rowCount > 0;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }

  async getActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async testConnection(): Promise<void> {
    const { db } = await import('./db.js');
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    // Test with a simple query using Drizzle syntax
    const { sql } = await import('drizzle-orm');
    await db.execute(sql`SELECT 1 as test`);
  }
}

// Create storage instance based on database availability
async function createStorage(): Promise<IStorage> {
  try {
    // Import db dynamically to avoid circular dependency issues
    const { db } = await import('./db.js');
    if (db) {
      // Test database connection with a quick timeout
      const dbStorage = new DatabaseStorage();
      // Test database connection with proper timeout
      try {
        await dbStorage.testConnection();
        console.log('✅ Using database storage with confirmed connection');
        return dbStorage;
      } catch (connectionError) {
        console.warn('⚠️ Database connection test failed, but will try to use database storage:', connectionError);
        return dbStorage;
      }
    }
  } catch (error: any) {
    console.log('⚠️ Database not available, using in-memory storage:', error?.message || 'Unknown error');
  }
  
  console.log('ℹ️ Using in-memory storage');
  return new MemStorage();
}

// Initialize storage instance
let storageInstance: IStorage | null = null;

export const initializeStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await createStorage();
  }
  return storageInstance;
};

export const getStorage = (): IStorage => {
  if (!storageInstance) {
    throw new Error('Storage not initialized. Call initializeStorage() first.');
  }
  return storageInstance;
};
