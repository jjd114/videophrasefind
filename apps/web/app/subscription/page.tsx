import { type Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/stripe-actions";

import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Subscription",
};

export default function Contact() {
  const { userId } = auth();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-8">
        <div className="flex min-w-[300px] flex-col gap-12 rounded-xl bg-[#0B111A] p-8">
          <div className="flex flex-col gap-6 text-center">
            <h3 className="text-2xl font-bold">Pro plan</h3>
            <h5>$7.00 / month</h5>
          </div>
          <form action={createCheckoutSession}>
            <input type="hidden" name="lookup_key" value="pro-month" />
            <Button>Checkout</Button>
          </form>
        </div>
        <div className="flex min-w-[300px] flex-col gap-12 rounded-xl bg-[#0B111A] p-8">
          <div className="flex flex-col gap-6 text-center">
            <h3 className="text-2xl font-bold">Pro plan</h3>
            <h5>$80.00 / month</h5>
          </div>
          <form action={createCheckoutSession}>
            <input type="hidden" name="lookup_key" value="pro-year" />
            <Button>Checkout</Button>
          </form>
        </div>
      </div>
      {userId && (
        <form className="text-center font-bold" action={createPortalSession}>
          <button id="checkout-and-portal-button" type="submit">
            <span className="underline">Manage your billing information</span>
          </button>
        </form>
      )}
    </section>
  );
}
