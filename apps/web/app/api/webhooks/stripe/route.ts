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

  console.log(`event: ${event.type}`);

  // - save userId, stripeCustomerId, stripeSubscriptionId, membership status in the database
  // - add transaction in the Transaction table
  // - event.data.object is a checkout session (https://docs.stripe.com/api/events/types#checkout_session_object)
  if (event.type === "checkout.session.completed") {
    console.log(`handling: ${event.type}`);

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription as string,
    );

    const subscriptionInterval = subscription.items.data[0].plan.interval;
    const billedMonthly = subscriptionInterval === "month";
    const subscriptionType = billedMonthly ? "pro" : "promax";

    const stripeCustomerId = subscription.customer as string;
    const stripeSubscriptionId = subscription.id;
    const stripeCurrentPeriodEnd = new Date(
      subscription.current_period_end * 1000,
    );

    await db.membership.upsert({
      where: {
        userId: event.data.object.client_reference_id as string,
      },
      create: {
        userId: event.data.object.client_reference_id as string,
        status: "active",
        type: subscriptionType,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeCurrentPeriodEnd,
      },
      update: {
        status: "active",
        type: subscriptionType,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeCurrentPeriodEnd,
      },
    });

    await db.transaction.create({
      data: {
        credits: billedMonthly ? 18000 : 18000 * 10,
        description: "siftvid.io Pro (Initial)",
        userId: event.data.object.client_reference_id as string,
      },
    });
  }

  // Continue to provision the subscription as payments continue to be made.
  // Store the status in your database and check when a user accesses your service.
  // This approach helps you avoid hitting rate limits.
  // - add transaction in the Transaction table
  // - event.data.object is an invoice (https://docs.stripe.com/api/invoices/object)
  if (event.type === "invoice.paid") {
    console.log(`handling: ${event.type}`);

    const result = await db.membership.findUnique({
      where: {
        stripeSubscriptionId: event.data.object.subscription as string,
      },
    });

    if (!result) {
      return new Response(
        "We need to wait for the initial subscription before provision access",
        { status: 200 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(
      event.data.object.subscription as string,
    );

    const subscriptionInterval = subscription.items.data[0].plan.interval;
    const billedMonthly = subscriptionInterval === "month";

    const { userId } = await db.membership.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: "active",
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });

    await db.transaction.create({
      data: {
        userId,
        credits: billedMonthly ? 18000 : 18000 * 10,
        description: "siftvid.io Pro (Provision)",
      },
    });
  }

  // Occurs whenever an invoice payment attempt fails,
  // due either to a declined payment or to the lack of a stored payment method.
  // - event.data.object is an invoice (https://docs.stripe.com/api/invoices/object)
  if (event.type === "invoice.payment_failed") {
    console.log(`handling: ${event.type}`);

    await db.membership.update({
      where: {
        stripeSubscriptionId: event.data.object.subscription as string,
      },
      data: {
        status: "paused",
        stripeCurrentPeriodEnd: null,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    try {
      console.log(`handling: ${event.type}`);

      await stripe.customers.del(event.data.object.customer as string);

      await db.membership.update({
        where: {
          stripeSubscriptionId: event.data.object.id,
        },
        data: {
          status: "inactive",
          type: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
    } catch (err) {
      console.log("Subscription not found in the database", err);
    }
  }

  return new Response(null, { status: 200 });
}
