import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  connectionString: process.env.DB_URL,
} satisfies Config;
