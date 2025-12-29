"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "全て" },
  { value: "美容・コスメ", label: "美容" },
  { value: "健康・フィットネス", label: "健康" },
  { value: "IT・テクノロジー", label: "IT" },
  { value: "生活・家事", label: "生活" },
  { value: "仕事・キャリア", label: "仕事" },
  { value: "趣味・エンタメ", label: "趣味" },
  { value: "その他", label: "その他" },
];

export function CategoryTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryChange(category.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            currentCategory === category.value
              ? "bg-[#1D1D1F] text-white"
              : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5E5]"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
