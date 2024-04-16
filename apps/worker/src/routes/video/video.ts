import { Hono } from "hono";

import {
  triggerSaveMetadataTask,
  triggerUpdateVideoProcessingStatusTask,
} from "./tasks";

const app = new Hono();

app.patch("/save-metadata", async (c) => {
  const { videoId, indexName } = await c.req.json<{
    videoId: string;
    indexName: string;
  }>();
  triggerSaveMetadataTask({ videoId, indexName });
  return c.json({ message: "Save video metadata task was triggered!" });
});

app.patch("/trigger-status-update", async (c) => {
  const { videoId, indexName } = await c.req.json<{
    videoId: string;
    indexName: string;
  }>();
  triggerUpdateVideoProcessingStatusTask({ videoId, indexName });
  return c.json({
    message: "Video processing task status update was triggered!",
  });
});

export default app;
