import { Hono } from "hono";

import { client12Labs } from "./twelveLabs/client";

import { transcriptionsSchema } from "./lib/utils";

const app = new Hono();

app.get("/:indexId/:videoId", async (c) => {
  const { indexId, videoId } = c.req.param();

  return c.json(
    transcriptionsSchema.parse(
      await client12Labs.index.video.transcription(indexId, videoId)
    )
  );
});

export default app;
