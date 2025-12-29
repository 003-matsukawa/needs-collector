import { Suspense } from "react";
import { Header } from "@/components/header";
import { NeedsList } from "@/components/needs-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-[#1D1D1F]">
          ブックマーク
        </h1>

        <Suspense
          fallback={
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          }
        >
          <NeedsList bookmarksOnly />
        </Suspense>
      </main>
    </div>
  );
}
