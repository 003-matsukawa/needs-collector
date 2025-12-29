import { Suspense } from "react";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsContent } from "@/components/settings-content";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <SettingsContent />
        </Suspense>
      </main>
    </div>
  );
}
