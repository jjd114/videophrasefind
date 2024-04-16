import { db } from "database";

import { client12Labs } from "../../twelveLabs/client";

import { get12LabsVideoId, getIndexId } from "./utils";

export const triggerSaveMetadataTask = async ({
  videoId,
  indexName,
}: {
  videoId: string;
  indexName: string;
}) => {
  console.log("start saving video metadata...", { videoId, indexName });

  let indexId = await getIndexId(indexName);

  while (!indexId) {
    indexId = await getIndexId(indexName);
    console.log("waiting for index ready...", { indexId });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      indexId,
    },
  });

  let twelveLabsVideoId = await get12LabsVideoId(indexId);

  while (!twelveLabsVideoId) {
    twelveLabsVideoId = await get12LabsVideoId(indexId);
    console.log("waiting for videoId ready...", { twelveLabsVideoId });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      twelveLabsVideoId,
    },
  });

  const {
    metadata: { duration, size },
  } = await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId);

  await db.video.update({
    where: { id: videoId },
    data: {
      duration,
      size,
    },
  });

  let hls = (
    await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId)
  ).hls;

  while (!hls) {
    hls = (await client12Labs.index.video.retrieve(indexId, twelveLabsVideoId))
      .hls;
    console.log("waiting for hls ready...", { hls });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      thumbnailUrl: hls.thumbnailUrls?.[0],
    },
  });
};
