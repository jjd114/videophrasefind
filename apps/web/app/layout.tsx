import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import QueryProvider from "@/components/providers/queryProvider";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - VideoPhraseFind",
    default: "VideoPhraseFind",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description: "Search for text spoken in your video.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            socialButtonsPlacement: "bottom",
          },
          variables: {
            colorPrimary: "#9333ea",
            colorBackground: "#0B111A",
            colorInputBackground: "transparent",
            colorInputText: "#9DA3AE",
            borderRadius: "0.5rem",
            colorAlphaShade: "#e2e8f0",
          },
        }}
      >
        <body
          className={`${inter.className} flex min-h-screen flex-col bg-[#161E2A]`}
        >
          <Analytics />
          <QueryProvider>
            <Header />
            <main className="flex flex-1 bg-[#161E2A] px-3 py-7 sm:px-7">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
