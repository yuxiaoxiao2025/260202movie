import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

console.log(process.env.DATABASE_HOST);
console.log(process.env.DATABASE_PASSWORD);

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.DATABASE_HOST || "",
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
  },
});
