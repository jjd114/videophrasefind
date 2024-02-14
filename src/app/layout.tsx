import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import QueryProvider from "./utils/queryProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoPhraseFind",
  description: "Search text spoken in your video",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen flex-col`}>
        <QueryProvider>
          <Header />
          <div className="flex flex-1 gap-10 overflow-hidden bg-[#161E2A] py-2.5 pr-10">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
