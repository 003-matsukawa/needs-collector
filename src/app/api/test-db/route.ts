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
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      hasUrl: !!process.env.DATABASE_URL
    }, { status: 500 });
  }
}
