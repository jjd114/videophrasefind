import { client12Labs } from "../twelveLabs/client";

export async function get12LabsVideoId(twelveLabsIndexId: string) {
  const [video] = await client12Labs.index.video.list(twelveLabsIndexId);

  return video?.id;
}

export async function getVideoProcessingStatus(twelveLabsIndexId: string) {
  return (await client12Labs.task.list({ indexId: twelveLabsIndexId }))[0]
    ?.status;
}

export async function getHLS({
  twelveLabsIndexId,
  twelveLabsVideoId,
}: {
  twelveLabsIndexId: string;
  twelveLabsVideoId: string;
}) {
  return (
    await client12Labs.index.video.retrieve(
      twelveLabsIndexId,
      twelveLabsVideoId
    )
  ).hls;
}
