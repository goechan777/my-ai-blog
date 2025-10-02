import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI活用ブログ（仮） | 最新AIツールの使い方を学ぶ",
  description: "非エンジニアでもわかる、最新AIツールの使い方や活用事例、ニュースを解説するブログです。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://my-ai-blog-smoky.vercel.app/",
    siteName: "AI活用ブログ（仮）",
    images: [
      {
        url: "/ogp-default.svg",
        width: 1200,
        height: 630,
        alt: "AI活用ブログ（仮）",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
