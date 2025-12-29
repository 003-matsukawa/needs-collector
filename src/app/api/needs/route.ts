import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { needs, bookmarks } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { createNeedSchema, searchNeedsSchema } from "@/lib/validations";
import { classifyNeed } from "@/lib/classifier";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = searchNeedsSchema.parse({
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    const conditions = [];

    if (params.q) {
      conditions.push(ilike(needs.content, `%${params.q}%`));
    }

    if (params.category && params.category !== "all") {
      conditions.push(eq(needs.category, params.category));
    }

    const offset = (params.page - 1) * params.limit;

    const result = await db
      .select({
        id: needs.id,
        content: needs.content,
        category: needs.category,
        platform: needs.platform,
        sourceUrl: needs.sourceUrl,
        author: needs.author,
        createdAt: needs.createdAt,
        isBookmarked: sql<boolean>`EXISTS (
          SELECT 1 FROM ${bookmarks}
          WHERE ${bookmarks.needId} = ${needs.id}
          AND ${bookmarks.userId} = ${session.user.id}
        )`,
      })
      .from(needs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(needs.createdAt))
      .limit(params.limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(needs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({
      data: result,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: Number(countResult[0].count),
      },
    });
  } catch (error) {
    console.error("GET /api/needs error:", error);
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
    const validated = createNeedSchema.parse(body);

    // Classify the content using Gemini
    const category = await classifyNeed(validated.content);

    const newNeed = await db
      .insert(needs)
      .values({
        id: nanoid(),
        content: validated.content,
        category,
        platform: validated.platform,
        sourceUrl: validated.sourceUrl || null,
        author: validated.author || null,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ data: newNeed[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/needs error:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Need ID is required" }, { status: 400 });
    }

    await db.delete(needs).where(and(eq(needs.id, id), eq(needs.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/needs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
