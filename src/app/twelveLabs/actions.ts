"use server";

import { z } from "zod";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";

import { client12Labs } from "@/app/twelveLabs/client";
import { engine } from "@/app/twelveLabs/engines";
import { transcriptionsSchema } from "@/app/twelveLabs/utils";

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

const tasksSchema = z.object({
  data: z.array(
    z
      .object({
        _id: z.string(),
      })
      .passthrough(),
  ),
  page_info: z.object({ page: z.number() }).passthrough(),
});

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

  const response = await fetch(url, options);

  const task = taskSchema.parse(await response.json());

  return task.video_id;
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

  const response = await fetch(url, options);

  const task = taskSchema.parse(await response.json());

  return task.status;
}

export async function trigger12LabsVideoUpload(videoUrl: string) {
  const { id } = await client12Labs.index.create({
    name: videoUrl,
    engines: engine,
    addons: ["thumbnail"],
  });

  client12Labs.task.create({
    indexId: id,
    url: videoUrl,
  });

  return id;
}

export async function getTaskData(indexId: string) {
  const url = `https://api.twelvelabs.io/v1.2/tasks?page=1&page_limit=10&sort_by=created_at&sort_option=desc&index_id=${indexId}`;

  const options: Parameters<typeof fetch>[1] = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.TWELVE_LABS_API_KEY as string,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(url, options);

  const json = tasksSchema.parse(await response.json());

  return json.data;
}

export async function generateTranscriptions(videoId: string, indexId: string) {
  console.log("generating transcriptions....");
  const transcriptions = await client12Labs.index.video.transcription(
    indexId,
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
