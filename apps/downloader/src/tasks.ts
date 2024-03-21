import { Hono } from "hono";
import { z } from "zod";

import { TASKS_URL } from "./lib/constants";
import { FetchOptions } from "./lib/types";

const statuses = [
  "validating",
  "pending",
  "indexing",
  "ready",
  "failed",
] as const;

const taskSchema = z
  .object({
    _id: z.string(),
    video_id: z.string(),
    status: z.enum(statuses),
  })
  .passthrough();

const app = new Hono();

app.get("/:taskId/status", async (c) => {
  const { taskId } = c.req.param();

  const url = `${TASKS_URL}/${taskId}`;

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY!,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(url, options);

  const task = taskSchema.parse(await response.json());

  return c.json({ status: task.status });
});

app.get("/:taskId/video", async (c) => {
  const { taskId } = c.req.param();

  const url = `${TASKS_URL}/${taskId}`;

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY!,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(url, options);

  const task = taskSchema.parse(await response.json());

  return c.json({ videoId: task.video_id });
});

export default app;
