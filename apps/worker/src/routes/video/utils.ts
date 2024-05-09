import { client12Labs } from "../../twelveLabs/client";

export const get12LabsVideoId = async (twelveLabsIndexId: string) => {
  const [video] = await client12Labs.index.video.list(twelveLabsIndexId);

  return video?.id;
};

export const getVideoProcessingStatus = async (twelveLabsIndexId: string) => {
  return (await client12Labs.task.list({ indexId: twelveLabsIndexId }))[0]
    ?.status;
};

export const getHLS = async ({
  twelveLabsIndexId,
  twelveLabsVideoId,
}: {
  twelveLabsIndexId: string;
  twelveLabsVideoId: string;
}) => {
  return (
    await client12Labs.index.video.retrieve(
      twelveLabsIndexId,
      twelveLabsVideoId
    )
  ).hls;
};
