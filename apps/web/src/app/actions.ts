"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getS3DirectoryUrl } from "@/app/utils/s3";

export async function getVideoUrl(s3Directory: string) {
  const url = `${getS3DirectoryUrl(s3Directory)}/video.webm`;
  console.log(`Checking if video exists: ${url}`);
  const res = await fetch(url, { cache: "no-cache", method: "HEAD" });

  if (res.status !== 200) {
    return null;
  }

  return url;
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
