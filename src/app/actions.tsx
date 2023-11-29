"use server";

import { jsonSchema } from "./utils/json.schema";

const S3_BASE =
  process.env.S3_BASE ||
  "https://videphrasefind.s3.eu-north-1.amazonaws.com/videos";

// This function should be triggered, but not awaited - the job is very long
export async function triggerVideoTranscription(rawVideoUrl: string) {
  console.log("Triggering video transcription:", rawVideoUrl);
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: rawVideoUrl }),
  });
  return "triggered";
}

export async function fetchTranscriptionJson(rawVideoUrl: string) {
  // We actually encode URI twice (!) because the s3 path itself is already URL-encoded string
  const res = await fetch(
    `${S3_BASE}/${encodeURIComponent(
      encodeURIComponent(rawVideoUrl),
    )}/result.json`,
  );

  return jsonSchema.parse(await res.json());
}
