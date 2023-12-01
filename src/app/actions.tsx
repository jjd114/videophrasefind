"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { jsonSchema } from "./utils/json.schema";
import { v4 as uuid } from "uuid";
import { getS3DirectoryUrl } from "./utils/s3";

// This function should be triggered, but not awaited - the job is very long
export async function triggerVideoTranscription(rawVideoUrl: string) {
  console.log("Triggering video transcription:", rawVideoUrl);
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: rawVideoUrl }),
    cache: "no-cache",
  });
  // Add a delay to make sure that request above has hit the API
  await new Promise((res) => setTimeout(res, 8000));
  return "triggered";
}

export async function getVideoUrl(s3Directory: string) {
  console.log(`Checking if video exists in directory: ${s3Directory}`);

  const url = `${getS3DirectoryUrl(s3Directory)}/video.webm`;
  const res = await fetch(url, { cache: "no-cache", method: "HEAD" });

  if (res.status !== 200) {
    return null;
  }

  return url;
}

export async function fetchTranscriptionResult(s3Directory: string) {
  const url = `${getS3DirectoryUrl(s3Directory)}/result.json`;
  console.log(`Fetching transcriptions from ${url}`);
  const res = await fetch(url, { cache: "no-cache" });

  if (res.status !== 200) {
    return null;
  }

  return jsonSchema.parse(await res.json());
}

export async function getUploadUrl() {
  const id = uuid();

  const client = new S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET || "",
    Key: `videos/${id}/video.webm`,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  const downloadUrl = uploadUrl.replace(/\?.*/, "");
  return { uploadUrl, s3Directory: id, downloadUrl };
}
