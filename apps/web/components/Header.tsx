"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { getMembershipData } from "@/app/membership-actions";

import { Icons } from "@/components/Icons";

import { cn } from "@/lib/utils";

const leftTabs = ["/", "/about", "/help", "/contact", "/pricing"] as const;

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const tabText = (tab: (typeof leftTabs)[number]) => {
  switch (tab) {
    case "/":
      return "Home";
    default:
      return capitalize(tab.slice(1));
  }
};

const Header = () => {
  const pathname = usePathname();

  const { userId } = useAuth();

  const membershipQuery = useQuery({
    enabled: !!userId,
    queryKey: ["credits", userId],
    queryFn: () => getMembershipData(),
  });

  return (
    <header className="flex items-center justify-center bg-[#101824] px-7 py-4">
      <div className="flex w-full max-w-[calc(theme(screens.2xl)-2*theme(padding.7))] items-center gap-8">
        <Link href="/" className="text-xl font-extrabold">
          VideoPhrase
          <span className="text-purple-600">Find</span>
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <nav className="flex items-center">
            <ul className="flex gap-8">
              {leftTabs.map((tab) => (
                <Link
                  key={tab}
                  href={tab}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neutral-300",
                    {
                      "font-bold": tab === pathname,
                    },
                  )}
                >
                  <li className="min-w-[63px] text-center">{tabText(tab)}</li>
                </Link>
              ))}
            </ul>
          </nav>
          <nav className="flex items-center gap-8">
            <SignedIn>
              {membershipQuery.data && (
                <span className="flex items-center gap-4 text-sm font-bold text-emerald-300">
                  <span>{`${membershipQuery.data.credits}`}</span>
                  <Icons.credits strokeWidth={2.0} className="size-4" />
                  <span>{`${membershipQuery.data.type === "pro" ? "Pro" : "Pro Max"} (${membershipQuery.data.status[0].toUpperCase() + membershipQuery.data.status.slice(1)})`}</span>
                </span>
              )}
              <Link
                href="/videos"
                className={cn(
                  "min-w-[63px] text-center text-sm font-medium transition-colors hover:text-neutral-300",
                  {
                    "font-bold": pathname === "/videos",
                  },
                )}
              >
                Videos
              </Link>
            </SignedIn>
            <div className="flex w-[50px] items-center justify-end">
              <ClerkLoading>
                <Icons.spinner className="size-6 animate-spin text-[#9DA3AE]" />
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className={cn(
                      "text-center text-sm font-medium transition-colors hover:text-neutral-300",
                      {
                        "font-bold":
                          pathname ===
                            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ||
                          pathname ===
                            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
                      },
                    )}
                  >
                    Sign in
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ClerkLoaded>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Header };
