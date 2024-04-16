import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { db } from "database";

import { formatDate, formatTime } from "@/lib/utils";

import { Icons } from "@/components/Icons";

const getVideos = async (userId: string) => {
  return db.video.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export default async function VideosPage() {
  const user = await currentUser();

  if (!user) return <div>no user found</div>;

  const videos = await getVideos(user.id);

  if (videos.length === 0) {
    return <div>you have no videos yet</div>;
  }

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-8">
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.indexName}`}>
          <div className="flex items-center gap-7 rounded-2xl bg-[#0b111a] p-8">
            <div className="relative flex aspect-video h-28 items-center justify-center rounded-xl bg-[#ffffff1f]">
              {video.thumbnailUrl ? (
                <Image
                  fill
                  src={video.thumbnailUrl}
                  alt="thumbnail"
                  className="rounded-xl object-contain"
                />
              ) : (
                <Icons.spinner className="size-5 animate-spin" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3 overflow-hidden">
              <div className="flex justify-between">
                <span>{`Title: ${video.title}`}</span>
                <span>{`Created at: ${formatDate(video.createdAt)} at ${formatTime(video.createdAt)}`}</span>
              </div>
              <div className="flex gap-10">
                <span>
                  Size:{" "}
                  {video.size
                    ? `${(video.size / 1e6).toFixed(2)}MB`
                    : "no size yet"}
                </span>
                <span>
                  Duration:{" "}
                  {video.duration
                    ? `${video.duration.toFixed(2)} sec.`
                    : "no duration yet"}
                </span>
              </div>
              <div className="flex flex-col">
                <span>{`Index id: ${video.indexId || "no index id yet"}`}</span>
                <span className="truncate">{`Index name: ${video.indexName}`}</span>
                <span>{`Video id: ${video.id}`}</span>
                <span>{`12Labs video id: ${video.twelveLabsVideoId || "no twelve labs video id yet"}`}</span>
                <span>{`Transcriptions status: ${video.status}`}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
