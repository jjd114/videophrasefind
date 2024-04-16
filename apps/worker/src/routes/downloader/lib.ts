import { client12Labs } from "../../twelveLabs/client";

import { engine } from "../../twelveLabs/engines";

export async function trigger12LabsTask({
  indexName,
  url,
}: {
  indexName: string;
  url: string;
}) {
  console.log("Triggering ", { indexName, url });

  const index = await client12Labs.index.create({
    name: indexName,
    engines: engine,
    addons: ["thumbnail"],
  });

  // console.log({ index });

  const task = await client12Labs.task.create({
    indexId: index.id,
    url,
  });

  // console.log({ task });

  return task;
}
