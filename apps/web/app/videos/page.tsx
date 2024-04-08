import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";
import Link from "next/link";

const getVideos = async (userId: string) => {
  return await db.video.findMany({
    where: { userId },
    include: {
      index: {
        select: {
          indexName: true,
        },
      },
    },
  });
};

export default async function VideosPage() {
  const user = await currentUser();

  if (!user) return <div>no user found</div>;

  const videos = await getVideos(user.id);

  console.log(videos);

  if (videos.length === 0) {
    return <div>you have no videos yet</div>;
  }

  return (
    <div className="flex max-w-[800px] flex-col gap-8">
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.index.indexName}`}>
          <div className="flex flex-col gap-3 rounded-lg border border-white p-5">
            <span>{`video id: ${video.id}`}</span>
            <span>{`video title: ${video.title}`}</span>
            <span>{`video index id: ${video.indexId}`}</span>
            <span>{`video index name: ${video.index.indexName}`}</span>
            <span>{`video size: ${video.size}`}</span>
            <span>{`video duration: ${video.duration}`}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
