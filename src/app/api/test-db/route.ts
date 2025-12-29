import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    return NextResponse.json({
      success: true,
      hasUrl: !!process.env.DATABASE_URL,
      userCount: result.length
    });
  } catch (error) {
    const urlInfo = process.env.DATABASE_URL
      ? `host: ${process.env.DATABASE_URL.split('@')[1]?.split(':')[0] || 'unknown'}`
      : 'no url';
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined,
      hasUrl: !!process.env.DATABASE_URL,
      urlInfo
    }, { status: 500 });
  }
}
