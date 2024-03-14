import { client12Labs } from "@/app/twelveLabs/client";
import { engine } from "@/app/twelveLabs/engines";

export const createIndex = async () => {
  const index = await client12Labs.index.create({
    name: "ANY_VIDEOS",
    engines: engine,
    addons: ["thumbnail"],
  });

  return index;
};
