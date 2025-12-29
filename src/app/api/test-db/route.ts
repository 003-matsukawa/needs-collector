import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  // Show partial URL for debugging (hide password)
  const debugUrl = url.replace(/:[^:@]+@/, ':****@');

  try {
    const sql = postgres(url, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
    });

    const result = await sql`SELECT NOW() as time`;
    await sql.end();

    return NextResponse.json({
      success: true,
      time: result[0].time,
      debugUrl
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown",
      debugUrl
    }, { status: 500 });
  }
}
