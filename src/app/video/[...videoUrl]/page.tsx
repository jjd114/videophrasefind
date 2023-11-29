import _ from "lodash";
import Content from "../../components/Content";
import { z } from "zod";
import { fetchTranscriptionJson } from "@/app/actions";
import Loader from "./loader";

interface Props {
  params: {
    videoUrl: string;
  };
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function VideoPage({ params }: Props) {
  const parseResult = z
    .string()
    .url()
    .safeParse(decodeURIComponent(params.videoUrl));

  if (!parseResult.success) {
    return <div>Invalid URL: {parseResult.error.message}</div>;
  }

  try {
    const parsed = await fetchTranscriptionJson(parseResult.data);

    return <Content data={parsed} />;
  } catch (e) {
    console.log(e);
    return <Loader />;
  }
}
