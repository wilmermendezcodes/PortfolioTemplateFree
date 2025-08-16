import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  preferences: jsonb("preferences").default({}),
  subscription: text("subscription").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'movie', 'book', 'music'
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata").default({}),
  mood: text("mood"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  recommendationId: varchar("recommendation_id").references(() => recommendations.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security tables
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rateLimits = pgTable("rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  identifier: text("identifier").notNull(),
  endpoint: text("endpoint").notNull(),
  requestsCount: integer("requests_count").default(1),
  windowStart: timestamp("window_start").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  recommendations: many(recommendations),
  favorites: many(favorites),
  activities: many(activities),
  userSessions: many(userSessions),
  auditLogs: many(auditLogs),
}));

export const recommendationsRelations = relations(recommendations, ({ one, many }) => ({
  user: one(users, {
    fields: [recommendations.userId],
    references: [users.id],
  }),
  favorites: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  recommendation: one(recommendations, {
    fields: [favorites.recommendationId],
    references: [recommendations.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
