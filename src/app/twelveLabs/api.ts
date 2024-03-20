import { z } from "zod";

type FetchOptions = Parameters<typeof fetch>[1];

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getUploadUrl() {
  const schema = z.object({
    uploadUrl: z.string(),
    s3Directory: z.string(),
    downloadUrl: z.string(),
  });

  const options: FetchOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-cache",
  };

  const response = await fetch(`${API_URL}/upload/url`, options);

  const json = schema.parse(await response.json());

  return json;
}
