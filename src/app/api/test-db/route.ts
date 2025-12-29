import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  const url = rawUrl.trim();
  const host = url.split('@')[1]?.split(':')[0];

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as time');
    await client.end();

    return NextResponse.json({
      success: true,
      time: result.rows[0].time,
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
