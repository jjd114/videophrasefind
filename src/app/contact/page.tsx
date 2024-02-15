import { type Metadata } from "next";

import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <div className="flex w-full max-w-[650px] flex-col gap-8 rounded-[32px] bg-[#0B111A] p-10">
      <h2 className="text-center text-2xl font-semibold">
        How can we help you with?
      </h2>
      <ContactForm />
    </div>
  );
}
