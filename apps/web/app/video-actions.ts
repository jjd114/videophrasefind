"use server";

import { db } from "database";
import { auth } from "@clerk/nextjs/server";

import { getS3DirectoryUrl } from "@/lib/s3";

export async function getVideoUrl(videoId: string) {
  const url = `${getS3DirectoryUrl(videoId)}/video.webm`;
  console.log(`Checking if video exists: ${url}`);
  const res = await fetch(url, { cache: "no-cache", method: "HEAD" });

  if (res.status !== 200) {
    return null;
  }

  return url;
}

export async function get12LabsVideoProcessingStatus(videoId: string) {
  const data = await db.videoMetadata.findUnique({
    where: { id: videoId },
    select: {
      twelveLabsVideos: {
        select: {
          status: true,
        },
      },
    },
  });

  return data?.twelveLabsVideos[0]?.status;
}

export async function get12LabsVideoIds(videoId: string) {
  const data = await db.videoMetadata.findUnique({
    where: { id: videoId },
    select: {
      twelveLabsVideos: {
        select: {
          twelveLabsIndexId: true,
          twelveLabsVideoId: true,
        },
      },
    },
  });

  return data?.twelveLabsVideos[0];
}

export async function createVideo() {
  const { userId } = auth();

  const video = await db.videoMetadata.create({
    data: {
      userId,
    },
  });

  return video.id;
}

export async function saveVideoTitleAndSize({
  id,
  title,
  size,
}: {
  id: string;
  title: string;
  size: number;
}) {
  const video = await db.videoMetadata.update({
    where: { id },
    data: { title, size },
  });

  return { title: video.title, size: video.size };
}
