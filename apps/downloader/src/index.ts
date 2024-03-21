import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import indexes from "./indexes";
import tasks from "./tasks";
import upload from "./upload";
import transcriptions from "./transcriptions";

dotenv.config();

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "GET"],
  })
);

app.get("/", async (c) => {
  return c.text("Hello from Root!");
});

app.route("/indexes", indexes);

app.route("/tasks", tasks);

app.route("/upload", upload);

app.route("/transcriptions", transcriptions);

const port = 5173;

console.log(`Server is running on ${port}...`);

serve({ fetch: app.fetch, port });
