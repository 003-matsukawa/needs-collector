import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { needs } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { searchThreadsNeeds } from "@/lib/threads";
import { classifyNeed } from "@/lib/classifier";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accessToken, keywords = [] } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Threads access token is required" },
        { status: 400 }
      );
    }

    // Search for needs on Threads
    const posts = await searchThreadsNeeds(accessToken, keywords);

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
