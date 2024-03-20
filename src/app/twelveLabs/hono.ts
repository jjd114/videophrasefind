import { z } from "zod";

type FetchOptions = Parameters<typeof fetch>[1];

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getUploadUrl() {
  const schema = z.object({
    uploadUrl: z.string(),
    s3Directory: z.string(),
    downloadUrl: z.string(),
  });

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/upload/url`, options);

  const json = schema.parse(await response.json());

  return json;
}

export async function trigger12LabsVideoUpload(
  videoUrl: string,
  indexName: string,
) {
  const schema = z.object({
    indexId: z.string(),
  });

  const options: FetchOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      videoUrl,
      indexName,
    }),
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/upload/12Labs/trigger`, options);

  const json = schema.parse(await response.json());

  return json.indexId;
}

export async function getTaskData(indexId: string) {
  const schema = z.object({
    data: z.array(
      z
        .object({
          _id: z.string(),
        })
        .passthrough(),
    ),
  });

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/indexes/${indexId}/data`, options);

  const json = schema.parse(await response.json());

  return json.data;
}

export async function getTaskStatus(taskId: string) {
  const schema = z.object({
    status: z.enum([
      "validating",
      "pending",
      "indexing",
      "ready",
      "failed",
    ] as const),
  });

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/tasks/${taskId}/status`, options);

  const json = schema.parse(await response.json());

  return json.status;
}

export async function getTaskVideoId(taskId: string) {
  const schema = z.object({ videoId: z.string() });

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/tasks/${taskId}/video`, options);

  const json = schema.parse(await response.json());

  return json.videoId;
}
