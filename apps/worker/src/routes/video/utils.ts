import { client12Labs } from "../../twelveLabs/client";

export const getIndexId = async (indexName: string) => {
  const [index] = await client12Labs.index.list({ name: indexName });

  return index?.id;
};

export const get12LabsVideoId = async (indexId: string) => {
  const [index] = await client12Labs.index.video.list(indexId);

  return index?.id;
};
