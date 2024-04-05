import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

import { AuthSpinner } from "@/app/(auth)/AuthSpinner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center">
      <ClerkLoaded>{children}</ClerkLoaded>
      <ClerkLoading>
        <AuthSpinner />
      </ClerkLoading>
    </section>
  );
}
