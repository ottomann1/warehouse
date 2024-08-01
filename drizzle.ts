import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  date,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
export const db = drizzle(sql);

export const carTable = pgTable("car", {
  id: uuid("id").primaryKey(),
  status: text("status").notNull(),
  model: text("model").notNull(),
  color: text("color"),
  brand: text("model").notNull(),
  productionYear: date("production-year"),
  price: numeric("price", { precision: 10, scale: 2 }),
  paymentStatus: text("payment-status"),
});
