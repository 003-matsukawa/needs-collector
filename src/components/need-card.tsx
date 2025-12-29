"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface NeedCardProps {
  id: string;
  content: string;
  category: string;
  platform: string;
  sourceUrl?: string | null;
  author?: string | null;
  createdAt: Date | string;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  onUnbookmark?: (id: string) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const platformLabels: Record<string, string> = {
  threads: "Threads",
  manual: "手動登録",
};

const platformIcons: Record<string, string> = {
  threads: "📱",
  manual: "✏️",
};

export function NeedCard({
  id,
  content,
  category,
  platform,
  sourceUrl,
  createdAt,
  isBookmarked = false,
  onBookmark,
  onUnbookmark,
  onDelete,
  showDelete = false,
}: NeedCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ja,
  });

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      onUnbookmark?.(id);
    } else {
      onBookmark?.(id);
    }
  };

  return (
    <Card className="group border-[#E5E5E5] bg-white transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <Badge
            variant="secondary"
            className="bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5E5]"
          >
            {category}
          </Badge>
          <div className="flex items-center gap-2">
            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#86868B] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmarkClick}
            >
              <Star
                className={`h-4 w-4 transition-colors ${
                  isBookmarked
                    ? "fill-[#007AFF] text-[#007AFF]"
                    : "text-[#86868B] hover:text-[#007AFF]"
                }`}
              />
            </Button>
          </div>
        </div>

        <p className="mb-4 leading-relaxed text-[#1D1D1F]">{content}</p>

        <div className="flex items-center justify-between text-sm text-[#86868B]">
          <div className="flex items-center gap-2">
            <span>{platformIcons[platform]}</span>
            <span>{platformLabels[platform]}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-[#007AFF]"
            >
              <ExternalLink className="h-3 w-3" />
              <span>元の投稿</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
