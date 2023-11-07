import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

const captionsVtt = `WEBVTT\n\
00:01.000 --> 00:04.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:05.000 --> 00:09.000\n\
- ${faker.lorem.sentence()}\n\
- ${faker.lorem.sentence()}\n\
`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("query");
  if (!query) return new NextResponse("Missing query", { status: 400 });

  const videoUrl = searchParams.get("videoUrl");
  if (!videoUrl) return new NextResponse("Missing videoUrl", { status: 401 });

  // Emulate slow transcribing process
  await new Promise((res) => setTimeout(res, 5000));

  return NextResponse.json({
    videoUrl:
      "https://cdmdemo.contentdm.oclc.org/utils/getfile/collection/p15700coll2/id/7/filename/video1.ogg",
    captionsVtt,
  });
}
