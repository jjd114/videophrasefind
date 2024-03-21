import { Hono } from "hono";
import ytdl from "ytdl-core";

import { getUploadUrl } from "./lib/s3";

import { client12Labs } from "./twelveLabs/client";
import { engine } from "./twelveLabs/engines";

const app = new Hono();

app.get("/url", async (c) => {
  return c.json(await getUploadUrl());
});

app.post("/s3/trigger", async (c) => {
  const { ytUrl } = await c.req.json<{
    ytUrl: string;
  }>();

  ytdl
    .getInfo(decodeURIComponent(ytUrl))
    .then((info) => {
      const format = ytdl.chooseFormat(info.formats, {
        quality: "22", // iTag value: resolution=720p, container=mp4, ...
        filter: "audioandvideo", // include audio, not only video
      });

      const filename = info.videoDetails.title.replaceAll(" ", "").trim();

      const mimeType = format.mimeType;

      let chunks: any[] = [];

      const readable = ytdl.downloadFromInfo(info, {
        format: format,
      });

      readable.on("data", (chunk) => {
        chunks = [...chunks, chunk];
      });

      readable.on("end", async () => {
        const blob = new Blob(chunks, { type: mimeType });

        const file = new File([blob], filename, { type: mimeType });

        const { uploadUrl, downloadUrl } = await getUploadUrl(ytUrl);

        console.log(downloadUrl);

        // trigger, but not wait, we will wait on a client side using polling
        fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        console.log("s3 upload was triggered");
      });
    })
    .catch((err) => {
      console.error(err);
    });

  return c.json({ message: `${ytUrl} - upload was triggered for the video` });
});

app.post("/12Labs/trigger", async (c) => {
  const { videoUrl, indexName } = await c.req.json<{
    videoUrl: string;
    indexName: string;
  }>();

  const { id } = await client12Labs.index.create({
    name: indexName,
    engines: engine,
    addons: ["thumbnail"],
  });

  // trigger, but not wait, we will wait on a client side using polling
  client12Labs.task.create({
    indexId: id,
    url: videoUrl,
  });

  return c.json({ indexId: id });
});

export default app;
