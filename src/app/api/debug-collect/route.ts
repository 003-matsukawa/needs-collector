import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { threadsConnections } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { isNeedContent } from "@/lib/classifier";

const THREADS_API_URL = "https://graph.threads.net/v1.0";

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
      return NextResponse.json({ error: "Not connected" }, { status: 400 });
    }

    const accessToken = connection[0].accessToken;

    // Fetch user's threads
    const response = await fetch(
      `${THREADS_API_URL}/me/threads?fields=id,text,username,permalink,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: "Threads API error",
        status: response.status,
        details: errorText
      }, { status: 500 });
    }

    const data = await response.json();

    // Analyze each post
    const analysis = data.data?.map((post: { id: string; text?: string }) => ({
      id: post.id,
      text: post.text?.substring(0, 100) || "(no text)",
      matchesNeedPattern: post.text ? isNeedContent(post.text) : false,
    })) || [];

    return NextResponse.json({
      totalPosts: data.data?.length || 0,
      postsWithNeedPatterns: analysis.filter((p: { matchesNeedPattern: boolean }) => p.matchesNeedPattern).length,
      posts: analysis.slice(0, 10), // Show first 10
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
