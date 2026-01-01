import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Threads OAuth authorization URL
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = process.env.THREADS_APP_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/threads/callback`;
    const scope = "threads_basic,threads_content_publish";

    const authUrl = `https://www.threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${session.user.id}`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Threads auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
