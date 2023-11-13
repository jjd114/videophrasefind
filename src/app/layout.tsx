import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import QueryProvider from "./utils/queryProvider";
import Sidebar from "./components/Sidebar";

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
      <body className={`${inter.className} h-screen flex flex-col`}>
        <QueryProvider>
          <Header />
          <div className="bg-[#161E2A] flex-1 flex py-2.5 pr-10 gap-10 overflow-hidden">
            <Sidebar />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
