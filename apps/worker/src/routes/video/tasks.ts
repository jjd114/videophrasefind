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
    console.log(indexId);
    console.log("waiting for index ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      indexId,
    },
  });

  console.log("indexId: " + indexId);

  let twelveLabsVideoId = await get12LabsVideoId(indexId);

  while (!twelveLabsVideoId) {
    twelveLabsVideoId = await get12LabsVideoId(indexId);
    console.log(videoId);
    console.log("waiting for videoId ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("12LabsVideoId: " + twelveLabsVideoId);

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
    console.log(hls);
    console.log("waiting for hls ready...");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await db.video.update({
    where: { id: videoId },
    data: {
      thumbnailUrl: hls.thumbnailUrls?.[0],
    },
  });
};
