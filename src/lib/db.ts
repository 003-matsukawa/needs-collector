import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  }
  return process.env.DATABASE_URL.trim();
};

const client = postgres(getDatabaseUrl(), {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 15,
});

export const db = drizzle(client, { schema });
