import { headers } from "next/headers";
import { db } from "database";

import { stripe, type StripeEvent } from "@/lib/stripe";

// The minimum event types to monitor:
// https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=stripe-hosted#provision-and-monitor
export async function POST(req: Request) {
  let event: StripeEvent;

  const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET as string;

  const rawText = await req.text();
  const signature = headers().get("stripe-signature") as string;

  try {
    event = stripe.webhooks.constructEvent(rawText, signature, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed!`);

    return new Response("Webhook Error!");
  }

  // - save userId, stripeCustomerId, stripeSubscriptionId, membership status in the database
  // - add transaction in the Transaction table
  // - event.data.object is a checkout session (https://docs.stripe.com/api/events/types#checkout_session_object)
  if (event.type === "checkout.session.completed") {
    console.log({ eventType: event.type });

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription as string,
    );

    // await db.membership.update({
    //   where: {
    //     stripeSubscriptionId: subscription.id,
    //   },
    //   data: {
    //     status: "active",
    //     userId: event.data.object.client_reference_id as string,
    //     stripeCustomerId: subscription.customer as string,
    //     stripeSubscriptionId: subscription.id,
    //   },
    // });
  }

  // Continue to provision the subscription as payments continue to be made.
  // Store the status in your database and check when a user accesses your service.
  // This approach helps you avoid hitting rate limits.
  // - add transaction in the Transaction table
  // - event.data.object is an invoice (https://docs.stripe.com/api/invoices/object)
  if (event.type === "invoice.paid") {
    console.log({ eventType: event.type });

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription as string,
    );

    // await db.membership.create({
    //   data: {
    //     stripeCurrentPeriodEnd: new Date(
    //       subscription.current_period_end
    //     ),
    //   },
    // });
  }

  // Occurs whenever an invoice payment attempt fails,
  // due either to a declined payment or to the lack of a stored payment method.
  // - event.data.object is an invoice (https://docs.stripe.com/api/invoices/object)
  if (event.type === "invoice.payment_failed") {
    console.log({ eventType: event.type });

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription as string,
    );

    // await db.membership.update({
    //   where: {
    //     stripeSubscriptionId: subscription.id,
    //   },
    //   data: {
    //     status: "inactive",
    //     stripeCurrentPeriodEnd: null,
    //   },
    // });
  }

  return new Response(null, { status: 200 });
}
