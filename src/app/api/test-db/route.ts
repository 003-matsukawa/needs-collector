import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  const url = rawUrl.trim();
  const host = url.split('@')[1]?.split(':')[0];

  try {
    const sql = neon(url);
    const result = await sql`SELECT NOW() as time`;

    return NextResponse.json({
      success: true,
      time: result[0].time,
      host
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown",
      host
    }, { status: 500 });
  }
}
