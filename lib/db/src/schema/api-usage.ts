import {
  pgTable,
  bigserial,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const apiUsageTable = pgTable("api_usage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  endpoint: varchar("endpoint", { length: 500 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  statusCode: integer("status_code").notNull(),
  durationMs: integer("duration_ms").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ApiUsage = typeof apiUsageTable.$inferSelect;
