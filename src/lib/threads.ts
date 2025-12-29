import { isNeedContent } from "./classifier";

interface ThreadsPost {
  id: string;
  text: string;
  username: string;
  permalink: string;
  timestamp: string;
}

interface ThreadsApiResponse {
  data: Array<{
    id: string;
    text?: string;
    username?: string;
    permalink?: string;
    timestamp?: string;
  }>;
  paging?: {
    cursors?: {
      after?: string;
    };
  };
}

const THREADS_API_URL = "https://graph.threads.net/v1.0";

export async function searchThreadsNeeds(
  accessToken: string,
  keywords: string[] = []
): Promise<ThreadsPost[]> {
  // Threads APIは検索機能が限定的なため、
  // ユーザーのフィードから取得してフィルタリングする方式
  const allPosts: ThreadsPost[] = [];

  try {
    // Get user's threads
    const response = await fetch(
      `${THREADS_API_URL}/me/threads?fields=id,text,username,permalink,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Threads API error: ${response.status}`);
    }

    const data: ThreadsApiResponse = await response.json();

    for (const post of data.data) {
      if (!post.text) continue;

      // Check if the post contains need patterns
      if (isNeedContent(post.text)) {
        // If keywords are specified, check if the post contains any of them
        if (
          keywords.length === 0 ||
          keywords.some((kw) => post.text!.toLowerCase().includes(kw.toLowerCase()))
        ) {
          allPosts.push({
            id: post.id,
            text: post.text,
            username: post.username || "unknown",
            permalink: post.permalink || "",
            timestamp: post.timestamp || new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Threads API error:", error);
  }

  return allPosts;
}

export async function getThreadsAccessToken(code: string): Promise<string> {
  const response = await fetch(`${THREADS_API_URL}/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.THREADS_APP_ID!,
      client_secret: process.env.THREADS_APP_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/collect/threads/callback`,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get Threads access token");
  }

  const data = await response.json();
  return data.access_token;
}
