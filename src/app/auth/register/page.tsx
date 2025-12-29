"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("パスワードは8文字以上で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "登録に失敗しました");
      } else {
        toast.success("アカウントを作成しました");
        router.push("/");
      }
    } catch {
      toast.error("登録に失敗しました");
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
            アカウント作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                type="text"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[#E5E5E5] bg-[#F5F5F7] focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>
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
                placeholder="8文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
                  作成中...
                </>
              ) : (
                "アカウントを作成"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#86868B]">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-[#007AFF] hover:underline">
              ログイン
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
