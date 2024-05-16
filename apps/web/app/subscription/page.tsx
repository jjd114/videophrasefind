import { type Metadata } from "next";

import { createCheckoutSession } from "@/app/stripe-actions";

export const metadata: Metadata = {
  title: "Subscription",
};

export default function Contact() {
  return (
    <section>
      <div className="product">
        <div className="description">
          <h3>Pro plan</h3>
          <h5>$7.00 / month</h5>
        </div>
      </div>
      <form action={createCheckoutSession}>
        <input type="hidden" name="lookup_key" value="pro-month" />
        <button>Checkout</button>
      </form>
    </section>
  );
}
