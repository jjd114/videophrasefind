"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = ["/", "/about", "/help", "/contact", "/sign-in"] as const;

const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

const tabText = (tab: (typeof tabs)[number]) => {
  switch (tab) {
    case "/":
      return "Home";
    case "/sign-in":
      return "Sign in";
    default:
      return capitalize(tab.slice(1));
  }
};

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-center bg-[#101824] px-7 py-4">
      <div className="flex w-full max-w-[calc(theme(screens.2xl)-2*theme(padding.7))] items-center justify-between max-[580px]:flex-col max-[580px]:gap-4">
        <Link href="/" className="text-2xl font-extrabold">
          <span>VideoPhrase</span>
          <span className="text-purple-600">Find</span>
        </Link>
        <nav>
          <ul className="flex gap-10">
            {tabs.map((tab) => (
              <Link
                key={tab}
                href={tab}
                className={`${tab === pathname ? "font-bold" : "font-medium hover:text-neutral-300"} transition-colors`}
              >
                <li className="min-w-[63px] text-center">{tabText(tab)}</li>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
