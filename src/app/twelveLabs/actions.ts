"use server";

import { client12Labs } from "@/app/twelveLabs/client";

import { engine } from "@/app/twelveLabs/engines";

import { transcriptionsSchema } from "@/app/twelveLabs/utils";

export async function uploadLocalVideoOn12Lab(videoUrl: string) {
  console.log("uploading to 12labs....");
  const task = await client12Labs.task.create({
    indexId: process.env.TWELVE_LABS_GLOBAL_INDEX_ID as string,
    url: videoUrl,
  });
  console.log("uploading to 12labs finished");

  console.log("indexing....");
  await task.waitForDone(500, () => {
    console.log(`Task status=${task.status}`);
  });
  console.log("indexing finished");

  return task.videoId;
}

export async function generateTranscriptions(videoId: string) {
  console.log("generating transcriptions....");
  const transcriptions = await client12Labs.index.video.transcription(
    process.env.TWELVE_LABS_GLOBAL_INDEX_ID as string,
    videoId,
  );
  console.log("generation transcriptions finish");

  return transcriptionsSchema.parse(transcriptions);
}

export async function createIndex() {
  const index = await client12Labs.index.create({
    name: "ANY",
    engines: engine,
    addons: ["thumbnail"],
  });

  return index;
}
