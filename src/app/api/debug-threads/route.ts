import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.THREADS_APP_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return NextResponse.json({
    appIdExists: !!appId,
    appIdLength: appId?.length,
    appIdValue: appId ? `${appId.slice(0, 4)}...${appId.slice(-4)}` : null,
    appIdHasWhitespace: appId !== appId?.trim(),
    appIdCharCodes: appId ? [...appId].slice(-5).map(c => c.charCodeAt(0)) : null,
    appUrlExists: !!appUrl,
    appUrl: appUrl,
    redirectUri: appUrl ? `${appUrl}/api/auth/threads/callback` : null,
  });
}
