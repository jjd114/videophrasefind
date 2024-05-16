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
    const signature = c.req.header("stripe-signature") as string;
    const rawText = await c.req.text();

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

  switch (event?.type) {
    case "checkout.session.completed":
      console.log(
        "userId from clerk: " + event.data.object.client_reference_id
      );
      break;
    default:
      console.log("Unhandled event type");
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
