"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ManualForm() {
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("内容を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/needs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          sourceUrl: sourceUrl.trim() || undefined,
          platform: "manual",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create need");
      }

      toast.success("ニーズを登録しました");
      setContent("");
      setSourceUrl("");
    } catch {
      toast.error("登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[#E5E5E5] bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#1D1D1F]">
          ニーズを手動登録
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-[#1D1D1F]">
              ニーズの内容 *
            </Label>
            <Textarea
              id="content"
              placeholder="例: もっと簡単にタスク管理できるアプリが欲しい..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-[#E5E5E5] bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl" className="text-[#1D1D1F]">
              元のURL（任意）
            </Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="border-[#E5E5E5] bg-[#F5F5F7] text-[#1D1D1F] placeholder:text-[#86868B] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#007AFF] py-5 text-white hover:bg-[#0056B3]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
