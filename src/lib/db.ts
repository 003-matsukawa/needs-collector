import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/drizzle/schema";

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder";
  }
  return process.env.DATABASE_URL;
};

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
