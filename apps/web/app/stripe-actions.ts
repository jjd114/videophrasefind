"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createCheckoutSession(formData: FormData) {
  const { userId } = auth();

  const prices = await stripe.prices.list({
    lookup_keys: [formData.get("lookup_key") as string],
    expand: ["data.product"],
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    client_reference_id: userId as string,
    mode: "subscription",
    success_url: `http://localhost:3000/about`,
    cancel_url: `http://localhost:3000/contact`,
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
  });

  redirect(session.url as string);
}
