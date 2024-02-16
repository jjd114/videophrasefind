"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname === "/terms-and-conditions") return null;

  return (
    <footer className="m-auto flex w-full max-w-screen-2xl justify-end bg-[#161E2A] px-7 py-10">
      <div className="inline-flex flex-col">
        <h2 className="my-3 text-sm font-medium">Company</h2>
        <ul className="text-sm">
          <Link href="/terms-and-conditions">
            <li>Terms and conditions</li>
          </Link>
        </ul>
      </div>
    </footer>
  );
};

export { Footer };
