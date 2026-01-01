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

    const clientId = process.env.THREADS_APP_ID?.trim();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!clientId) {
      console.error("THREADS_APP_ID is not configured");
      return NextResponse.json({ error: "THREADS_APP_ID not configured" }, { status: 500 });
    }

    if (!appUrl) {
      console.error("NEXT_PUBLIC_APP_URL is not configured");
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL not configured" }, { status: 500 });
    }

    const redirectUri = `${appUrl}/api/auth/threads/callback`;
    const scope = "threads_basic,threads_content_publish";

    const authUrl = new URL("https://www.threads.net/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", session.user.id);

    console.log("Redirecting to Threads OAuth:", authUrl.toString());

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Threads auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
