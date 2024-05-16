import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { stripe } from "./lib/stripe";

import downloader from "./routes/downloader/downloader";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "GET", "PATCH"],
  })
);

app.post("/webhook", async (c) => {
  let event;

  const webhookSecret = process.env.WEBHOOK_SIGNING_SECRET;

  if (webhookSecret) {
    const rawText = await c.req.text();
    const signature = c.req.header("stripe-signature") as string;

    try {
      event = stripe.webhooks.constructEvent(rawText, signature, webhookSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed!`);

      return c.json({
        success: false,
        message: "Error occureed in /webhook endpoint!",
      });
    }
  }

  try {
    switch (event?.type) {
      case "checkout.session.completed":
        console.log(`clerk userId: ${event.data.object.client_reference_id}`);
        // - save userId, customerId, sessionId, subscription status in the database
        // - add transaction in the Transaction table
        break;
      case "invoice.paid":
        console.log("add credits", {
          customerId: event.data.object.customer,
        });
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        // - add transaction in the Transaction table
        break;
      case "invoice.payment_failed":
        // Occurs whenever an invoice payment attempt fails,
        // due either to a declined payment or to the lack of a stored payment method.
        break;
      default:
        console.log("Unhandled event type");
    }
  } catch (err) {
    console.log(err);
  }

  return c.json({
    success: true,
    message: "Hello World from /webhook endpoint!",
  });
});

app.get("/", async (c) => {
  return c.text("Hello from Root!");
});

app.route("/downloader", downloader);

const port = 5173;

console.log(`Server is running on ${port}...`);

serve({ fetch: app.fetch, port });
