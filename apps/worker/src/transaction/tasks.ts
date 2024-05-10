import { db } from "database";

import { calculateCredits, transactionDescription } from "./utils";

export async function triggerCreateTransactionTask({
  videoId,
  twelveLabsIndexId,
  shouldBeCropped,
  transcriptionDuration,
}: {
  videoId: string;
  twelveLabsIndexId: string;
  shouldBeCropped: boolean;
  transcriptionDuration: number;
}) {
  console.log(`Create transaction task was triggered`);

  const video = await db.videoMetadata.findUnique({
    where: {
      id: videoId,
    },
    select: {
      userId: true,
    },
  });

  if (!video?.userId) return;

  await db.transaction.create({
    data: {
      type: "OUT",
      description: transactionDescription[shouldBeCropped ? "cropped" : "full"],
      credits: calculateCredits(transcriptionDuration),
      twelveLabsIndexId,
      userId: video.userId,
    },
  });
}
