import { currentUser } from "@clerk/nextjs";

export default async function VideosPage() {
  const user = await currentUser();

  return (
    <div className="flex max-w-[800px] flex-col gap-8">
      <h2 className="underline">Uploaded videos will be here</h2>
      <span>{`user id: ${user?.id}`}</span>
      <span>{`user username: ${user?.username}`}</span>
      <span>{`user firstName: ${user?.firstName || "not specified"}`}</span>
      <span>{`user lastName: ${user?.lastName || "not specified"}`}</span>
      <span>{`user hasImage: ${user?.hasImage}`}</span>
    </div>
  );
}
