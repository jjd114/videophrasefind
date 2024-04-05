import { ClerkProvider as CP } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CP
      appearance={{
        layout: {
          socialButtonsPlacement: "top",
        },
        variables: {
          colorText: "white",
          colorPrimary: "#9333ea",
          colorInputBackground: "transparent",
          colorInputText: "#9DA3AE",
          borderRadius: "0.5rem",
          colorAlphaShade: "#e2e8f0",
        },
        elements: {
          card: "shadow-none bg-[#0b111a]",
          footer: "justify-center",
          footerAction: "gap-2",
        },
      }}
    >
      {children}
    </CP>
  );
}
