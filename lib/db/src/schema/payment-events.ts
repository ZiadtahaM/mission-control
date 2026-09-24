import {
  pgTable,
  bigserial,
  uuid,
  varchar,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

// APPEND-ONLY — never update or delete rows
export const paymentEventsTable = pgTable("payment_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  stripeEventId: varchar("stripe_event_id", { length: 255 }).unique(),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  amountCents: integer("amount_cents"),
  currency: varchar("currency", { length: 10 }),
  status: varchar("status", { length: 50 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PaymentEvent = typeof paymentEventsTable.$inferSelect;
