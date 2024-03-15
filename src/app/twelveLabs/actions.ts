"use server";

import { z } from "zod";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";

import { client12Labs } from "@/app/twelveLabs/client";
import { engine } from "@/app/twelveLabs/engines";
import { transcriptionsSchema } from "@/app/twelveLabs/utils";

export async function getTaskVideoId(taskId: string) {
  const url = `https://api.twelvelabs.io/v1.2/tasks/${taskId}`;

  const options: Parameters<typeof fetch>[1] = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY as string,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  };

  console.log("videoId loading...");
  const response = await fetch(url, options);

  const task = await response.json();
  console.log("videoId loading finish...");

  return task.videoId;
}

export async function getTaskStatus(taskId: string) {
  const url = `https://api.twelvelabs.io/v1.2/tasks/${taskId}`;

  const options: Parameters<typeof fetch>[1] = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY as string,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  };

  console.log(taskId);

  console.log("status loading...");
  const response = await fetch(url, options);

  const task = await response.json();
  console.log("status loading finish");

  console.log(task);

  console.log(task.status);

  return { status: task.status, videoId: task.video_id };
}

export async function uploadAndIndexVideoOn12Lab(videoUrl: string) {
  console.log("uploading to 12labs....");
  const task = await client12Labs.task.create({
    indexId: process.env.TWELVE_LABS_GLOBAL_INDEX_ID as string,
    url: videoUrl,
  });
  console.log("uploading to 12labs finished");

  // console.log("indexing....");
  // await task.waitForDone(500, () => {
  //   console.log(`Task status=${task.status}`);
  // });
  // console.log("indexing finished");

  return task.id;
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

// mb better promise.all then sort?
export async function retrieveThumbnails(
  parsedCaptions: Entry[],
  videoId: string,
) {
  const schema = z.object({
    thumbnail: z.string(),
  });

  const url = `https://api.twelvelabs.io/v1.2/indexes/${process.env.TWELVE_LABS_GLOBAL_INDEX_ID as string}/videos/${videoId}/thumbnail`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY as string,
      "Content-Type": "application/json",
    },
  };

  let thumbnails: string[] = [];

  for (let i = 0; i < parsedCaptions.length; i++) {
    const time = Math.floor(parsedCaptions[i].from / 1000);

    const response = await fetch(`${url}?time=${time}`, options);

    const { thumbnail } = schema.parse(await response.json());

    thumbnails = [...thumbnails, thumbnail];
  }

  return thumbnails;
}

export async function createIndex() {
  const index = await client12Labs.index.create({
    name: "ANY",
    engines: engine,
    addons: ["thumbnail"],
  });

  return index;
}
