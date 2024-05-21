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

import { formatDate, formatTime } from "@/lib/utils";

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
    <section className="flex flex-col gap-6">
      {!membership || membership.status === "inactive" ? (
        <div className="flex gap-12">
          {types.map((type) => (
            <div
              key={type}
              className="flex flex-col gap-14 rounded-2xl border border-slate-800 bg-[#0B111A] p-10 text-center shadow-md"
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
                <CheckoutButton />
              </form>
            </div>
          ))}
        </div>
      ) : (
        <>
          {membership.stripeCustomerId ? (
            <div className="flex w-full max-w-[450px] flex-col gap-14 rounded-2xl border border-slate-800 bg-[#0B111A] p-10 text-center shadow-md">
              <ul>
                <li>{`Membership status: ${membership.status}`}</li>
                {membership.stripeCurrentPeriodEnd ? (
                  <li>{`Next payment date: ${formatDate(membership.stripeCurrentPeriodEnd, true)} at ${formatTime(membership.stripeCurrentPeriodEnd)}`}</li>
                ) : null}
              </ul>
              <form action={createPortalSession}>
                <input
                  type="hidden"
                  name="customer_id"
                  value={membership.stripeCustomerId}
                />
                <Button className="size-full">
                  Manage your billing information
                </Button>
              </form>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
