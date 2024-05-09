import { db } from "database";
import { getVideoDurationInSeconds } from "get-video-duration";

import { client12Labs } from "../../twelveLabs/client";
import { engine } from "../../twelveLabs/engines";

import { getS3DirectoryUrl } from "../../lib/s3";

import {
  MAX_SECONDS_ALLOWED_TO_TRANSCRIBE_FOR_FREE,
  cropAndUploadToS3,
} from "./utils";

import {
  triggerSaveMetadataTask,
  triggerUpdateVideoProcessingTaskStatus,
} from "../video/tasks";

export async function trigger12LabsTask({ videoId }: { videoId: string }) {
  console.log(`Triggering 12Labs task for: ${videoId}`);

  const duration = await getVideoDurationInSeconds(
    `${getS3DirectoryUrl(videoId)}/video.webm`
  );
  console.log({ duration });

  await db.videoMetadata.update({
    where: {
      id: videoId,
    },
    data: {
      duration,
    },
  });

  const shouldBeCropped = duration > MAX_SECONDS_ALLOWED_TO_TRANSCRIBE_FOR_FREE;

  const index = await client12Labs.index.create({
    name: `${shouldBeCropped ? "cropped" : "full"}.${videoId}`,
    engines: engine,
    addons: ["thumbnail"],
  });
  console.log({ index });

  const { twelveLabsIndexId } = await db.twelveLabsVideo.create({
    data: {
      twelveLabsIndexId: index.id,
      videoMetadataId: videoId,
      full: !shouldBeCropped,
      duration: shouldBeCropped
        ? MAX_SECONDS_ALLOWED_TO_TRANSCRIBE_FOR_FREE
        : duration,
    },
  });

  if (shouldBeCropped) {
    await cropAndUploadToS3(videoId);

    await client12Labs.task.create({
      indexId: index.id,
      url: `${getS3DirectoryUrl(videoId)}/video.cropped.webm`,
    });
  } else {
    await client12Labs.task.create({
      indexId: index.id,
      url: `${getS3DirectoryUrl(videoId)}/video.webm`,
    });
  }

  triggerSaveMetadataTask({ twelveLabsIndexId, videoId });
  triggerUpdateVideoProcessingTaskStatus({ twelveLabsIndexId });
}
