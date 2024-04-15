import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { db } from "database";

const getVideos = async (userId: string) => {
  return await db.video.findMany({
    where: { userId },
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
        <Link key={video.id} href={`/video/${video.indexName}`}>
          <div className="flex flex-col gap-3 rounded-lg border border-white p-5">
            <span>{`video id: ${video.id}`}</span>
            <span>{`video title: ${video.title}`}</span>
            <span>{`video index id: ${video?.indexId || "no index id yet"}`}</span>
            <span>{`video index name: ${video.indexName}`}</span>
            <span>{`video size: ${video?.size || "no size yet"}`}</span>
            <span>{`video duration: ${video.duration || "no duration yet"}`}</span>
            <span>{`video duration: ${video.thumbnailUrl || "no thumbnail yet"}`}</span>
            <span>{`video createdAt: ${video.createdAt}`}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
