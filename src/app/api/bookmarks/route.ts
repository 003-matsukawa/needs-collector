import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookmarks, needs } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { createBookmarkSchema } from "@/lib/validations";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select({
        id: needs.id,
        content: needs.content,
        category: needs.category,
        platform: needs.platform,
        sourceUrl: needs.sourceUrl,
        author: needs.author,
        createdAt: needs.createdAt,
        bookmarkId: bookmarks.id,
        bookmarkedAt: bookmarks.createdAt,
      })
      .from(bookmarks)
      .innerJoin(needs, eq(bookmarks.needId, needs.id))
      .where(eq(bookmarks.userId, session.user.id))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json({
      data: result.map((r) => ({
        ...r,
        isBookmarked: true,
      })),
    });
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createBookmarkSchema.parse(body);

    // Check if already bookmarked
    const existing = await db
      .select()
      .from(bookmarks)
      .where(
        and(eq(bookmarks.userId, session.user.id), eq(bookmarks.needId, validated.needId))
      );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 400 });
    }

    const newBookmark = await db
      .insert(bookmarks)
      .values({
        id: nanoid(),
        userId: session.user.id,
        needId: validated.needId,
      })
      .returning();

    return NextResponse.json({ data: newBookmark[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const needId = searchParams.get("needId");

    if (!needId) {
      return NextResponse.json({ error: "Need ID is required" }, { status: 400 });
    }

    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, session.user.id), eq(bookmarks.needId, needId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
