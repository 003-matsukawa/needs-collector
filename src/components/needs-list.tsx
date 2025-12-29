"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { NeedCard } from "./need-card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Need {
  id: string;
  content: string;
  category: string;
  platform: string;
  sourceUrl: string | null;
  author: string | null;
  createdAt: string;
  isBookmarked: boolean;
}

interface NeedsListProps {
  bookmarksOnly?: boolean;
}

export function NeedsList({ bookmarksOnly = false }: NeedsListProps) {
  const searchParams = useSearchParams();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = bookmarksOnly
        ? "/api/bookmarks"
        : `/api/needs?${searchParams.toString()}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch");

      const json = await response.json();
      setNeeds(json.data);
    } catch {
      toast.error("データの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [bookmarksOnly, searchParams]);

  useEffect(() => {
    fetchNeeds();
  }, [fetchNeeds]);

  const handleBookmark = async (id: string) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ needId: id }),
      });

      if (!response.ok) throw new Error("Failed to bookmark");

      setNeeds((prev) =>
        prev.map((need) =>
          need.id === id ? { ...need, isBookmarked: true } : need
        )
      );
      toast.success("ブックマークに追加しました");
    } catch {
      toast.error("ブックマークの追加に失敗しました");
    }
  };

  const handleUnbookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/bookmarks?needId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unbookmark");

      if (bookmarksOnly) {
        setNeeds((prev) => prev.filter((need) => need.id !== id));
      } else {
        setNeeds((prev) =>
          prev.map((need) =>
            need.id === id ? { ...need, isBookmarked: false } : need
          )
        );
      }
      toast.success("ブックマークを解除しました");
    } catch {
      toast.error("ブックマークの解除に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/needs?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setNeeds((prev) => prev.filter((need) => need.id !== id));
      toast.success("ニーズを削除しました");
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (needs.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#86868B]">
          {bookmarksOnly
            ? "ブックマークがありません"
            : "ニーズが見つかりませんでした"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {needs.map((need) => (
        <NeedCard
          key={need.id}
          {...need}
          onBookmark={handleBookmark}
          onUnbookmark={handleUnbookmark}
          onDelete={handleDelete}
          showDelete={!bookmarksOnly}
        />
      ))}
    </div>
  );
}
