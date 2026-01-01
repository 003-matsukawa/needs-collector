import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.THREADS_APP_ID?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const redirectUri = `${appUrl}/api/auth/threads/callback`;
  const scope = "threads_basic,threads_content_publish";

  const authUrl = new URL("https://www.threads.net/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId || "");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", "test_user_id");

  return NextResponse.json({
    clientId: clientId,
    redirectUri: redirectUri,
    generatedAuthUrl: authUrl.toString(),
    rawQueryString: authUrl.search,
  });
}
