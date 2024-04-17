"use server";

import { z } from "zod";
import { type Entry } from "@plussub/srt-vtt-parser/dist/src/types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { type SearchData } from "twelvelabs-js";

import { getVideoIndexId } from "@/app/video-actions";

import { client12Labs } from "@/twelveLabs/client";

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

export async function trigger(url: string, indexName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/downloader/trigger`,
    {
      method: "POST",
      body: JSON.stringify({ indexName, url }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    },
  );
  return res.json();
}

export async function fetchAndTrigger(url: string) {
  const schema = z.object({
    s3Directory: z.string(),
    videoTitle: z.string(),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/downloader/fetch-and-trigger`,
    {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    },
  );

  return schema.parse(await res.json());
}

export async function getSemanticSearchResult(videoId: string, query: string) {
  const indexId = await getVideoIndexId(videoId);

  if (!indexId) return [];

  const search = await client12Labs.search.query({
    indexId,
    query: query,
    options: ["conversation"],
    conversationOption: "semantic",
  });

  const result = (search.data as SearchData[]).map((clip) => ({
    entry: {
      id: "",
      from: clip.start * 1000,
      to: clip.end * 1000,
      text: clip.metadata?.[0].text,
    } as Entry,
    thumbnailSrc: clip.thumbnailUrl,
    confidence: clip.confidence,
  }));

  return result;
}
