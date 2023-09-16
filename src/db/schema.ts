import { sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const moenyLogs = sqliteTable("money_log", {
  id: integer("id").primaryKey(),
  amount: integer("amount").notNull(),
  note: text("note").notNull(),
})

export type MoneyLog = typeof moenyLogs.$inferSelect
