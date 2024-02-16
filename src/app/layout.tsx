import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from "@/app/components/Header";

import QueryProvider from "@/app/utils/queryProvider";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoPhraseFind",
  description: "Search text spoken in your video.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-screen flex-col bg-[#161E2A]`}
      >
        <QueryProvider>
          <Header />
          <main className="flex flex-1 bg-[#161E2A]">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
