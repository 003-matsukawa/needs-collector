"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Link2, Unlink, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [threadsStatus, setThreadsStatus] = useState<{
    connected: boolean;
    threadsUserId?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollecting, setIsCollecting] = useState(false);

  useEffect(() => {
    // Handle URL params for success/error messages
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "threads_connected") {
      toast.success("Threadsアカウントを連携しました");
    }
    if (error) {
      toast.error("連携に失敗しました");
    }

    // Fetch Threads status
    fetchThreadsStatus();
  }, [searchParams]);

  const fetchThreadsStatus = async () => {
    try {
      const response = await fetch("/api/threads/status");
      const data = await response.json();
      setThreadsStatus(data);
    } catch {
      toast.error("ステータスの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectThreads = () => {
    window.location.href = "/api/auth/threads";
  };

  const handleDisconnectThreads = async () => {
    try {
      const response = await fetch("/api/threads/status", {
        method: "DELETE",
      });

      if (response.ok) {
        setThreadsStatus({ connected: false });
        toast.success("連携を解除しました");
      }
    } catch {
      toast.error("連携解除に失敗しました");
    }
  };

  const handleCollectNeeds = async () => {
    setIsCollecting(true);
    try {
      const response = await fetch("/api/collect/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "ニーズを収集しました");
      } else {
        toast.error(data.error || "収集に失敗しました");
      }
    } catch {
      toast.error("収集に失敗しました");
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[#86868B] transition-colors hover:text-[#1D1D1F]"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>

        <h1 className="mb-6 text-2xl font-semibold text-[#1D1D1F]">設定</h1>

        <Card className="border-[#E5E5E5] bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-[#1D1D1F]">
              Threads連携
            </CardTitle>
            <CardDescription className="text-[#86868B]">
              Threadsアカウントを連携して、自動でニーズを収集できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[#86868B]">
                <Loader2 className="h-4 w-4 animate-spin" />
                読み込み中...
              </div>
            ) : threadsStatus?.connected ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                  <Link2 className="h-4 w-4" />
                  <span>連携済み（ID: {threadsStatus.threadsUserId}）</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCollectNeeds}
                    disabled={isCollecting}
                    className="bg-[#007AFF] text-white hover:bg-[#0056B3]"
                  >
                    {isCollecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        収集中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        今すぐ収集
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDisconnectThreads}
                    className="border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    連携解除
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-[#86868B]">
                  Threadsアカウントを連携すると、フォロー中のユーザーの投稿からニーズを自動収集できます。
                </p>
                <Button
                  onClick={handleConnectThreads}
                  className="bg-[#1D1D1F] text-white hover:bg-[#424245]"
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Threadsを連携
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-[#E5E5E5] bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-[#1D1D1F]">
              ニーズ検出パターン
            </CardTitle>
            <CardDescription className="text-[#86868B]">
              以下のパターンを含む投稿を自動的に収集します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm text-[#1D1D1F]">
              <div>
                <h4 className="font-medium">願望・欲求</h4>
                <p className="text-[#86868B]">〜したい、〜が欲しい、〜ないかな</p>
              </div>
              <div>
                <h4 className="font-medium">困りごと</h4>
                <p className="text-[#86868B]">〜に困ってる、〜が大変、〜がめんどう</p>
              </div>
              <div>
                <h4 className="font-medium">探索・要望</h4>
                <p className="text-[#86868B]">〜探してる、〜おすすめ教えて、〜知りたい</p>
              </div>
              <div>
                <h4 className="font-medium">不満・改善</h4>
                <p className="text-[#86868B]">〜が使いにくい、〜してほしい、もっと〜</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
