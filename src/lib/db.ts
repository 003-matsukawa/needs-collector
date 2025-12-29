import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@/drizzle/schema";

// Configure WebSocket for serverless
neonConfig.webSocketConstructor = ws;

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  }
  return process.env.DATABASE_URL;
};

const pool = new Pool({ connectionString: getDatabaseUrl() });
export const db = drizzle(pool, { schema });
