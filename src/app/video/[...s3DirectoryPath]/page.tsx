import _ from "lodash";
import { type Metadata } from "next";

import Content from "@/app/components/Content";

import { fetchTranscriptionResult, getVideoUrl } from "@/app/actions";

interface Props {
  params: {
    s3DirectoryPath: string;
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function fixEncoding(s: string) {
  // For whatever reason this is needed to get proper s3 directory path
  return encodeURIComponent(decodeURIComponent(s));
}

export const metadata: Metadata = {
  title: "Transcription",
  description:
    "Here you can see your transcribed video and search for keywords without watching the video",
};

export default async function VideoPage({ params }: Props) {
  const s3DirectoryPath = fixEncoding(params.s3DirectoryPath);

  const [videoUrl, transcriptionData] = await Promise.all([
    getVideoUrl(s3DirectoryPath),
    fetchTranscriptionResult(s3DirectoryPath),
  ]);

  return <Content videoUrl={videoUrl} data={transcriptionData} />;
}
