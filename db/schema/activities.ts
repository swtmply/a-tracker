import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  metrics: text("metrics", { mode: "json" })
    .$type<{ name: string; score: number }[]>()
    .default([]),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const activitiesRelations = relations(activities, ({ many }) => ({
  entries: many(entries),
}));

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id)
    .references(() => activities.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  score: integer("score").notNull(),
});

export const entriesRelations = relations(entries, ({ one }) => ({
  activity: one(activities, {
    fields: [entries.activityId],
    references: [activities.id],
  }),
}));
