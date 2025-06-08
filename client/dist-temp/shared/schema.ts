import {
  pgTable,
  text,
  varchar,
  timestamp,
  serial,
  boolean,
  decimal,
  jsonb,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin users table for Firebase Auth
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().notNull(), // Firebase UID
  email: varchar("email").unique(),
  displayName: varchar("display_name"),
  photoURL: varchar("photo_url"),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customer users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  alcoholContent: decimal("alcohol_content", { precision: 3, scale: 1 }),
  volume: integer("volume"), // in ml
  imageUrl: varchar("image_url", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("unread"),
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Analytics events table
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: jsonb("event_data"),
  userId: integer("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fan Gallery table
export const fanPhotos = pgTable("fan_photos", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  caption: text("caption").notNull(),
  imageData: text("image_data").notNull(), // base64 encoded image
  userId: integer("user_id").references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by", { length: 255 }),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  analyticsEvents: many(analyticsEvents),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  alcoholContent: true,
  volume: true,
  imageUrl: true,
  stock: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  shippingAddress: true,
  paymentMethod: true,
  notes: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
  eventType: true,
  eventData: true,
  userId: true,
  sessionId: true,
  ipAddress: true,
  userAgent: true,
});

export const insertFanPhotoSchema = createInsertSchema(fanPhotos).pick({
  name: true,
  caption: true,
  imageData: true,
});

export const upsertAdminUserSchema = createInsertSchema(adminUsers).pick({
  id: true,
  email: true,
  displayName: true,
  photoURL: true,
  role: true,
  isActive: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertAdminUser = z.infer<typeof upsertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertFanPhoto = z.infer<typeof insertFanPhotoSchema>;
export type FanPhoto = typeof fanPhotos.$inferSelect;
