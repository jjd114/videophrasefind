import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import ytdl from "ytdl-core";
import { db } from "database";

import { getUploadUrl } from "./lib/s3";

import { client12Labs } from "./twelveLabs/client";
import { engine } from "./twelveLabs/engines";

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

async function trigger12LabsTask({
  indexName,
  url,
}: {
  indexName: string;
  url: string;
}) {
  console.log("Triggering ", { indexName, url });

  const index = await client12Labs.index.create({
    name: indexName,
    engines: engine,
    addons: ["thumbnail"],
  });
  // console.log({ index });

  const task = await client12Labs.task.create({
    indexId: index.id,
    url,
  });
  // console.log({ task });
  return task;
}

app.post("/trigger", async (c) => {
  const { indexName, url } = await c.req.json<{
    indexName: string;
    url: string;
  }>();
  trigger12LabsTask({ indexName, url });
  return c.json({ message: "Job triggered" });
});

app.post("/fetch-and-trigger", async (c) => {
  const { url } = await c.req.json<{
    url: string;
  }>();
  console.log("Fetching video", { url });

  const info = await ytdl.getInfo(url);

  const format = ytdl.chooseFormat(info.formats, {
    quality: "22", // iTag value: resolution=720p, container=mp4, ...
    filter: "audioandvideo", // include audio, not only video
  });

  const filename = info.videoDetails.title.replaceAll(" ", "").trim();

  const mimeType = format.mimeType;

  let chunks: BlobPart[] = [];

  const readable = ytdl.downloadFromInfo(info, { format });

  readable.on("data", (chunk) => {
    chunks.push(chunk);
  });

  const s3path = encodeURIComponent(url);
  const { uploadUrl, downloadUrl, s3Directory } = await getUploadUrl(s3path);

  readable.on("end", async () => {
    console.log("Fetching done, uploading to s3", { downloadUrl });
    const blob = new Blob(chunks, { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });

    // trigger, but not wait, we will wait on a client side using polling
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
    console.log("Upload done", { downloadUrl });

    return trigger12LabsTask({ indexName: s3Directory, url: downloadUrl });
  });

  return c.json({ s3Directory, videoTitle: info.videoDetails.title });
});

const port = 5173;

console.log(`Server is running on ${port}...`);

serve({ fetch: app.fetch, port });
