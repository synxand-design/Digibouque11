import { pgTable, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

/**
 * Every creation is persisted in PostgreSQL with a unique short public id.
 * The `data` column stores the full design (items, background, wrap, message, etc.).
 * Photos and music are stored as data URLs so shared links never depend on browser state.
 */
export const creations = pgTable("creations", {
  id: text("id").primaryKey(),
  occasion: text("occasion").notNull(),
  title: text("title").notNull().default(""),
  recipient: text("recipient").notNull().default(""),
  sender: text("sender").notNull().default(""),
  message: text("message").notNull().default(""),
  data: jsonb("data").notNull(),
  photos: jsonb("photos").notNull().default([]),
  music: text("music"),
  musicName: text("music_name"),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CreationRow = typeof creations.$inferSelect;
