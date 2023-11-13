import Content from "../../components/Content";
import { z } from "zod";

interface Props {
  params: {
    videoUrl: string;
  };
}

export default function VideoPage({ params }: Props) {
  const parseResult = z
    .string()
    .url()
    .safeParse(decodeURIComponent(params.videoUrl));

  if (!parseResult.success) {
    return <div>Invalid URL: {parseResult.error.message}</div>;
  }

  return <Content videoUrl={parseResult.data} />;
}
