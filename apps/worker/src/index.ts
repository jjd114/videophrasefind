import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import video from "./routes/video/video";
import downloader from "./routes/downloader/downloader";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "GET", "PATCH"],
  })
);

app.get("/", async (c) => {
  return c.text("Hello from Root!");
});

app.route("/downloader", downloader);
app.route("/video", video);

const port = 5173;

console.log(`Server is running on ${port}...`);

serve({ fetch: app.fetch, port });
