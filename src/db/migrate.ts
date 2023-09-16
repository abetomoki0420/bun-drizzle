import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { db } from "./core"

migrate(db, {
  migrationsFolder: "./migrations",
})
