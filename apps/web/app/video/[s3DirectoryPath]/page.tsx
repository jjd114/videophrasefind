import _ from "lodash";
import { type Metadata } from "next";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";

import Content from "@/components/Content";

import { getVideoUrl } from "@/app/actions";
import { client12Labs } from "@/twelveLabs/client";
import { transcriptionsSchema } from "@/twelveLabs/utils";

interface Props {
  params: {
    s3DirectoryPath: string;
  };
  searchParams: { query?: string };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Transcription",
  description:
    "Here you can see your transcribed video and search for keywords without watching the video",
};

async function getSemanticSearchTranscriptions(
  indexName: string,
  query: string,
) {
  console.log(indexName);
  console.log(query);

  return [
    { id: "", from: 900, to: 610, text: "- I swear," },
    { id: "", from: 620, to: 810, text: "- man," },
    {
      id: "",
      from: 819,
      to: 2809,
      text: "- Liverpool really outplayed Chelsea in this one.",
    },
  ] as Entry[];
}

async function getTranscriptions(indexName: string) {
  const [index] = await client12Labs.index.list({ name: indexName });
  console.log({ index, indexName });
  if (!index) return { ready: false, data: null };

  const [task] = await client12Labs.task.list({ indexId: index.id });
  console.log({ task });
  if (!task) return { ready: false, data: null };

  if (task.status !== "ready")
    return {
      ready: false,
      estimatedTime: task.estimatedTime,
      data: null,
    };

  const [video] = await client12Labs.index.video.list(index.id);
  console.log({ video });
  const result = await client12Labs.index.video.transcription(
    index.id,
    video.id,
  );

  const data = transcriptionsSchema.parse(result);
  return { ready: true, data };
}

export default async function VideoPage({
  params: { s3DirectoryPath },
  searchParams: { query },
}: Props) {
  const [videoUrl, { data }] = await Promise.all([
    getVideoUrl(s3DirectoryPath),
    getTranscriptions(s3DirectoryPath),
  ]);

  const semanticSearchResult = query
    ? await getSemanticSearchTranscriptions(
        s3DirectoryPath,
        decodeURIComponent(query),
      )
    : [];

  return (
    <Content
      videoUrl={videoUrl}
      data={data}
      semanticSearchResult={semanticSearchResult}
    />
  );
}
