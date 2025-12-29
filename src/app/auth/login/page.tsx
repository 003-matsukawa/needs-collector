"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "ログインに失敗しました");
      } else {
        router.push("/");
      }
    } catch {
      toast.error("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4">
      <Card className="w-full max-w-md border-[#E5E5E5] bg-white">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 text-2xl font-semibold text-[#1D1D1F]">
            NEEDS
          </Link>
          <CardTitle className="text-xl font-medium text-[#1D1D1F]">
            ログイン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#E5E5E5] bg-[#F5F5F7] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#E5E5E5] bg-[#F5F5F7] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#007AFF] text-white hover:bg-[#0056B3]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#86868B]">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/auth/register"
              className="text-[#007AFF] hover:underline"
            >
              新規登録
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
