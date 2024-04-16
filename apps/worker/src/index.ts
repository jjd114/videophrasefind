import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "database";

import downloader from "./routes/downloader/downloader";

import { client12Labs } from "./twelveLabs/client";

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

const getIndexId = async (indexName: string) => {
  const [index] = await client12Labs.index.list({ name: indexName });

  return index?.id;
};

const get12LabsVideoId = async (indexId: string) => {
  const [index] = await client12Labs.index.video.list(indexId);

  return index?.id;
};

app.patch("/save-video-metadata", async (c) => {
  const { videoId, indexName } = await c.req.json<{
    videoId: string;
    indexName: string;
  }>();

  console.log(videoId, indexName);

  console.log("start saving video metadata...");

  let indexId = await getIndexId(indexName);

  while (!indexId) {
    indexId = await getIndexId(indexName);
    console.log(indexId);
    console.log("waiting for index ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      indexId,
    },
  });

  console.log("indexId: " + indexId);

  let twelveLabsVideoId = await get12LabsVideoId(indexId);

  while (!twelveLabsVideoId) {
    twelveLabsVideoId = await get12LabsVideoId(indexId);
    console.log(videoId);
    console.log("waiting for videoId ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("12LabsVideoId: " + twelveLabsVideoId);

  const {
    metadata: { duration, size },
  } = await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId);

  await db.video.update({
    where: { id: videoId },
    data: {
      duration,
      size,
    },
  });

  return c.json({ message: "Video metadata was successfully saved" });
});

app.patch("/save-video-thumbnail", async (c) => {
  const { videoId, indexName } = await c.req.json<{
    videoId: string;
    indexName: string;
  }>();

  console.log(videoId, indexName);

  console.log("start saving video thumbnail...");

  let indexId = await getIndexId(indexName);

  while (!indexId) {
    indexId = await getIndexId(indexName);
    console.log(indexId);
    console.log("waiting for index ready (thumbnail)...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("indexId: " + indexId);

  let twelveLabsVideoId = await get12LabsVideoId(indexId);

  while (!twelveLabsVideoId) {
    twelveLabsVideoId = await get12LabsVideoId(indexId);
    console.log(videoId);
    console.log("waiting for videoId ready (thubmnail)...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("12LabsVideoId: " + twelveLabsVideoId);

  let hls = (
    await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId)
  ).hls;

  while (!hls) {
    hls = (await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId))
      .hls;
    console.log(hls);
    console.log("waiting for hls ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      thumbnailUrl: hls.thumbnailUrls?.[0],
    },
  });

  return c.json({ message: "Video thumbnail was successfully saved" });
});

app.route("/downloader", downloader);

const port = 5173;

console.log(`Server is running on ${port}...`);

serve({ fetch: app.fetch, port });
