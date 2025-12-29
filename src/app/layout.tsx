import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEEDS - SNSニーズ収集アプリ",
  description: "SNSからニーズを収集し、ジャンル別に分類・管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
