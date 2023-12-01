import _ from "lodash";
import Content from "../../components/Content";
import { fetchTranscriptionResult, getVideoUrl } from "@/app/actions";

interface Props {
  params: {
    s3DirectoryPath: string;
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function VideoPage({ params }: Props) {
  const [videoUrl, transcriptionData] = await Promise.all([
    getVideoUrl(params.s3DirectoryPath),
    fetchTranscriptionResult(params.s3DirectoryPath),
  ]);

  return <Content videoUrl={videoUrl} data={transcriptionData} />;
}
