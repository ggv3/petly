import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	username: varchar("username", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
