import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

// Handle missing DATABASE_URL during build time
const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  }
  return process.env.DATABASE_URL;
};

const connectionString = getDatabaseUrl();
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
