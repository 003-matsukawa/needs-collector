import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { threadsConnections } from "@/drizzle/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const userId = searchParams.get("state");

    if (!code || !userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=missing_params`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://graph.threads.net/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.THREADS_APP_ID!,
          client_secret: process.env.THREADS_APP_SECRET!,
          grant_type: "authorization_code",
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL?.trim()}/api/auth/threads/callback/`,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id: threadsUserId } = tokenData;

    // Get long-lived token
    const longLivedResponse = await fetch(
      `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${process.env.THREADS_APP_SECRET}&access_token=${access_token}`
    );

    let finalToken = access_token;
    let expiresAt = null;

    if (longLivedResponse.ok) {
      const longLivedData = await longLivedResponse.json();
      finalToken = longLivedData.access_token;
      expiresAt = new Date(Date.now() + longLivedData.expires_in * 1000);
    }

    // Save or update connection
    const existing = await db
      .select()
      .from(threadsConnections)
      .where(eq(threadsConnections.userId, userId));

    if (existing.length > 0) {
      await db
        .update(threadsConnections)
        .set({
          accessToken: finalToken,
          threadsUserId: threadsUserId.toString(),
          tokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(threadsConnections.userId, userId));
    } else {
      await db.insert(threadsConnections).values({
        id: nanoid(),
        userId,
        threadsUserId: threadsUserId.toString(),
        accessToken: finalToken,
        tokenExpiresAt: expiresAt,
      });
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=threads_connected`
    );
  } catch (error) {
    console.error("Threads callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=callback_failed`
    );
  }
}
