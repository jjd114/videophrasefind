import { Hono } from "hono";

import { triggerSaveMetadataTask } from "./tasks";

const app = new Hono();

app.patch("/save-metadata", async (c) => {
  const { videoId, indexName } = await c.req.json<{
    videoId: string;
    indexName: string;
  }>();
  triggerSaveMetadataTask({ videoId, indexName });
  return c.json({ message: "Video metadata save task was triggered!" });
});

export default app;
