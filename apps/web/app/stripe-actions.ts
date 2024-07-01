"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(formData: FormData) {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const prices = await stripe.prices.list({
    lookup_keys: [formData.get("lookup_key") as string],
    expand: ["data.product"],
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    client_reference_id: userId,
    mode: "subscription",
    success_url: `${process.env.BASE_URL}/`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
  });

  redirect(session.url as string);
}

export async function createPortalSession(formData: FormData) {
  const customerId = formData.get("customer_id") as string;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.BASE_URL}/`,
  });

  redirect(portalSession.url);
}
