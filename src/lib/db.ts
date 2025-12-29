import { drizzle } from "drizzle-orm/neon-http";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";

// Handle missing DATABASE_URL during build time
const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy connection for build time
    // This will fail at runtime if DATABASE_URL is not set
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  }
  return process.env.DATABASE_URL;
};

const sql: NeonQueryFunction<false, false> = neon(getDatabaseUrl());

export const db = drizzle(sql, { schema });
