import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { threadsConnections } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connection = await db
      .select()
      .from(threadsConnections)
      .where(eq(threadsConnections.userId, session.user.id));

    if (connection.length === 0) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      threadsUserId: connection[0].threadsUserId,
      expiresAt: connection[0].tokenExpiresAt,
    });
  } catch (error) {
    console.error("Threads status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(threadsConnections)
      .where(eq(threadsConnections.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Threads disconnect error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
