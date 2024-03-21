import { Hono } from "hono";
import { z } from "zod";

import { TASKS_URL } from "./lib/constants";
import { FetchOptions } from "./lib/types";

const tasksSchema = z.object({
  data: z.array(
    z
      .object({
        _id: z.string(),
      })
      .passthrough()
  ),
  page_info: z.object({ page: z.number() }).passthrough(),
});

const app = new Hono();

app.get("/:indexId/data", async (c) => {
  const { indexId } = c.req.param();

  const url = `${TASKS_URL}?page=1&page_limit=10&sort_by=created_at&sort_option=desc&index_id=${indexId}`;

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

  const json = tasksSchema.parse(await response.json());

  return c.json({ data: json.data });
});

export default app;
