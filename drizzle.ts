import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
export const db = drizzle(sql);

export const carsTable = pgTable("cars", {
  id: uuid("id").primaryKey(),
  status: text("status").notNull(),
});
