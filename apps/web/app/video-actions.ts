"use server";

import { db } from "database";
import { auth } from "@clerk/nextjs";

import { getS3DirectoryUrl } from "@/lib/s3";

export async function getVideoUrl(videoId: string) {
  const data = await db.video.findUnique({
    where: { id: videoId },
    select: { indexName: true },
  });

  if (!data) return null;

  const url = `${getS3DirectoryUrl(data.indexName)}/video.webm`;
  console.log(`Checking if video exists: ${url}`);
  const res = await fetch(url, { cache: "no-cache", method: "HEAD" });

  if (res.status !== 200) {
    return null;
  }

  return url;
}

export async function getVideoProcessingStatus(videoId: string) {
  const data = await db.video.findUnique({
    where: { id: videoId },
    select: { status: true },
  });

  return data?.status;
}

export async function getVideo12LabsIds(videoId: string) {
  const data = await db.video.findUnique({
    where: { id: videoId },
    select: { twelveLabsVideoId: true, indexId: true },
  });

  return { ...data };
}

export async function getVideoIndexId(videoId: string) {
  const data = await db.video.findUnique({
    where: { id: videoId },
    select: { indexId: true },
  });

  return data?.indexId;
}

export async function saveVideo({
  videoTitle,
  indexName,
}: {
  videoTitle: string;
  indexName: string;
}) {
  const { userId } = await auth();

  const { id } = await db.video.create({
    data: {
      title: videoTitle,
      indexName,
      userId,
    },
  });

  const metadataRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/video/trigger-save-metadata`,
    {
      method: "PATCH",
      body: JSON.stringify({ videoId: id, indexName }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    },
  );

  console.log(await metadataRes.json());

  const statusUpdateRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/video/trigger-status-update`,
    {
      method: "PATCH",
      body: JSON.stringify({ videoId: id, indexName }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    },
  );

  console.log(await statusUpdateRes.json());

  return id;
}
