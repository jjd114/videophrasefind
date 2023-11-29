import _ from "lodash";
import Content from "../../components/Content";
import { fetchTranscriptionJson } from "@/app/actions";
import Loader from "./loader";

interface Props {
  params: {
    s3DirectoryPath: string;
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function VideoPage({ params }: Props) {
  try {
    const parsed = await fetchTranscriptionJson(
      decodeURIComponent(params.s3DirectoryPath),
    );

    return <Content data={parsed} />;
  } catch (e) {
    console.log(e);
    return <Loader />;
  }
}
