import { NextResponse } from "next/server";
import postgres from "postgres";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  try {
    const sql = postgres(url, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    const result = await sql`SELECT 1 as test`;
    await sql.end();

    return NextResponse.json({
      success: true,
      result: result[0],
      host: url.split('@')[1]?.split(':')[0]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown",
      cause: error instanceof Error && error.cause ? String(error.cause) : undefined,
      host: url.split('@')[1]?.split(':')[0]
    }, { status: 500 });
  }
}
