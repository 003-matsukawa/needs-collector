import { Header } from "@/components/header";
import { ManualForm } from "@/components/manual-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[#86868B] transition-colors hover:text-[#1D1D1F]"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>

        <ManualForm />
      </main>
    </div>
  );
}
