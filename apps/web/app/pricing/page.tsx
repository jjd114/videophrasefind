import { type Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { db } from "database";

import { Icons } from "@/components/Icons";
import { SubmitButton } from "@/app/pricing/submit-button";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/stripe-actions";

import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Pricing",
};

const cards = [
  {
    type: "Hobby",
    price: 0,
    billed: "Monthly",
    lookup_key: undefined,
    bullets: [
      "Transcribe videos up to 1 minute",
      "Semantic search",
      "Uploads history",
    ],
  },
  {
    type: "Pro",
    price: 7,
    billed: "Monthly",
    lookup_key: "pro-month",
    bullets: ["18000 credits / month", "Cropped videos re-transcription"],
  },
  {
    type: "Pro Max",
    price: 80,
    billed: "Yearly",
    lookup_key: "pro-year",
    bullets: [
      "180000 credits / year",
      "Cropped videos re-transcription",
      "Another Pro Max feature #1",
      "Another Pro Max feature #2",
    ],
  },
];

export default async function Contact() {
  const { userId } = auth();

  const membership = userId
    ? await db.membership.findUnique({
        where: {
          userId,
        },
      })
    : null;

  return (
    <section>
      {!membership || membership.status === "inactive" ? (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-6xl font-bold leading-[1.1]">
              Choose your plan
            </h2>
            <p className="text-white/70">
              Unlock all features including full video transcription.
            </p>
          </div>
          <div className="flex gap-7">
            {cards.map((card) => (
              <div
                key={card.type}
                className="flex min-w-[435px] flex-col gap-14 rounded-2xl border border-slate-800 bg-[#0B111A] p-8 text-center shadow-md transition-transform hover:scale-[1.02]"
              >
                <div className="flex flex-col gap-5 text-center">
                  <h3 className="text-2xl font-bold">
                    VideoPhrase
                    <span className="bg-gradient-to-r from-purple-600  to-indigo-400 bg-clip-text text-transparent">
                      Find
                    </span>
                    {` ${card.type}`}
                  </h3>
                  <div>
                    <h5 className="text-7xl font-bold">{`$${card.price}.00`}</h5>
                    <p className="text-sm text-white/70">{`Billed ${card.billed}`}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <h5>{`What's included in the ${card.type} plan`}</h5>
                  <ul className="flex flex-col gap-2 text-white/70">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <Icons.check className="size-4" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {card.type === "Hobby" ? (
                  <form
                    action={async () => {
                      "use server";

                      if (userId) redirect("/");

                      redirect("sign-in");
                    }}
                  >
                    <SubmitButton
                      text={userId ? "Start Transcribing" : "Get Started"}
                    />
                  </form>
                ) : (
                  <form action={createCheckoutSession}>
                    <input
                      type="hidden"
                      name="lookup_key"
                      value={card.lookup_key}
                    />
                    <SubmitButton text={"Get Started"} />
                  </form>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {membership.stripeCustomerId && (
            <div className="flex h-[250px] w-[495px] flex-col justify-evenly gap-10 rounded-2xl border border-slate-800 bg-[#0B111A] p-7 text-center shadow-md">
              <div className="flex flex-col gap-2 text-start">
                <span className="text-xs">{`Current plan`}</span>
                <h3 className="space-y-3 text-3xl font-bold">
                  VideoPhrase
                  <span className="bg-gradient-to-r from-purple-600  to-indigo-400 bg-clip-text text-transparent">
                    Find
                  </span>
                  {` ${membership.type === "pro" ? "Pro" : "Pro Max"}`}
                </h3>
                {membership.stripeCurrentPeriodEnd && (
                  <p className="text-sm text-white/70">
                    Your next bill is for{" "}
                    <span className="font-semibold">{`$${membership.type === "pro" ? 7 : 80}.00`}</span>{" "}
                    on{" "}
                    <span className="font-semibold">{`${formatDate(membership.stripeCurrentPeriodEnd)}`}</span>
                    .
                  </p>
                )}
              </div>
              <form action={createPortalSession}>
                <input
                  type="hidden"
                  name="customer_id"
                  value={membership.stripeCustomerId}
                />
                <SubmitButton text="Manage your billing information" />
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
}
