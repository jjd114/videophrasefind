import { type Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { db } from "database";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/app/pricing/checkout-button";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/stripe-actions";

import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Subscription",
};

const types = ["month", "year"] as const;

const proIncluded = [
  "18000 credits ~ 300 min. of video transcription",
  "Cropped videos re-transcription",
] as const;

const proMaxIncluded = [
  "180000 credits ~ 3000 min. of video transcription",
  "Cropped videos re-transcription",
  "Another Pro Max feature #1",
  "Another Pro Max feature #2",
] as const;

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
        <div className="flex gap-14">
          {types.map((type) => (
            <div
              key={type}
              className="flex flex-col gap-14 rounded-2xl border border-slate-800 bg-[#0B111A] p-10 text-center shadow-md transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-col gap-5 text-center">
                <h3 className="text-2xl font-bold">
                  VideoPhrase
                  <span className="bg-gradient-to-r from-purple-600  to-indigo-400 bg-clip-text text-transparent">
                    Find
                  </span>
                  {` ${type === "month" ? "Pro" : "Pro Max"}`}
                </h3>
                <div>
                  <h5 className="text-7xl font-bold">{`$${type === "month" ? "7" : "80"}.00`}</h5>
                  <p className="text-sm text-white/70">{`Billed ${type === "month" ? "Monthly" : "Yearly"}`}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <h5>{`What's included in the ${type === "month" ? "Pro" : "Pro Max"} plan`}</h5>
                <ul className="flex flex-col gap-2 text-white/70">
                  {(type === "month" ? proIncluded : proMaxIncluded).map(
                    (bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <Icons.check className="size-4" />
                        <span>{bullet}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <form action={createCheckoutSession}>
                <input type="hidden" name="lookup_key" value={`pro-${type}`} />
                <CheckoutButton text="Get Started" />
              </form>
            </div>
          ))}
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
                    <span className="font-semibold">{`$${membership.type === "pro" ? "8" : "80"}.00`}</span>{" "}
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
                <CheckoutButton text="Manage your billing information" />
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
}
