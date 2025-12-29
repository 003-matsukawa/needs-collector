import { NextResponse } from "next/server";
import postgres from "postgres";
import dns from "dns";
import { promisify } from "util";

const lookup = promisify(dns.lookup);

export async function GET() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  const url = rawUrl.trim();
  const host = url.split('@')[1]?.split(':')[0];

  // Test DNS resolution first
  let dnsResult = null;
  try {
    dnsResult = await lookup(host || '');
  } catch (dnsErr) {
    return NextResponse.json({
      success: false,
      step: "dns",
      error: dnsErr instanceof Error ? dnsErr.message : "DNS failed",
      host
    }, { status: 500 });
  }

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
      host,
      ip: dnsResult?.address
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      step: "connect",
      error: error instanceof Error ? error.message : "Unknown",
      host,
      ip: dnsResult?.address
    }, { status: 500 });
  }
}
