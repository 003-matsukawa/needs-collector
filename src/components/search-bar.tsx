"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, 300);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#86868B]" />
      <Input
        type="text"
        placeholder="キーワードで検索..."
        value={value}
        onChange={onChange}
        className="rounded-xl border-[#E5E5E5] bg-[#F5F5F7] py-5 pr-4 pl-10 text-[#1D1D1F] placeholder:text-[#86868B] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
      />
    </div>
  );
}
