import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { needs, threadsConnections } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { searchThreadsNeeds } from "@/lib/threads";
import { classifyNeed } from "@/lib/classifier";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stored Threads connection
    const connection = await db
      .select()
      .from(threadsConnections)
      .where(eq(threadsConnections.userId, session.user.id));

    if (connection.length === 0) {
      return NextResponse.json(
        { error: "Threadsアカウントが連携されていません" },
        { status: 400 }
      );
    }

    const accessToken = connection[0].accessToken;

    // Get keywords from request body (optional)
    let keywords: string[] = [];
    try {
      const body = await request.json();
      keywords = body.keywords || [];
    } catch {
      // No body or invalid JSON, use empty keywords
    }

    // Search for needs on Threads
    const posts = await searchThreadsNeeds(accessToken, keywords);

    if (posts.length === 0) {
      return NextResponse.json({
        data: [],
        message: "新しいニーズは見つかりませんでした",
      });
    }

    // Process and save each post
    const savedNeeds = [];

    for (const post of posts) {
      const category = await classifyNeed(post.text);

      const newNeed = await db
        .insert(needs)
        .values({
          id: nanoid(),
          content: post.text,
          category,
          platform: "threads",
          sourceUrl: post.permalink,
          author: post.username,
          userId: session.user.id,
        })
        .returning();

      savedNeeds.push(newNeed[0]);
    }

    return NextResponse.json({
      data: savedNeeds,
      message: `${savedNeeds.length}件のニーズを収集しました`,
    });
  } catch (error) {
    console.error("POST /api/collect/threads error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
