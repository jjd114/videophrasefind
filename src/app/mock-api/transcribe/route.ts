import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

export const revalidate = 30;

const captionsVtt = `WEBVTT\n\
00:01.000 --> 00:04.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:05.000 --> 00:09.000\n\
- ${faker.lorem.sentence()}\n\
- ${faker.lorem.sentence()}\n\
\n\
00:09.000 --> 00:15.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:09.000 --> 00:15.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:15.000 --> 00:20.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:20.000 --> 00:25.000\n\
- ${faker.lorem.sentence()}\n\
\n\
00:25.000 --> 00:30.000\n\
- ${faker.lorem.sentence()}\n\
\n\
`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const videoUrl = searchParams.get("videoUrl");
  if (!videoUrl) return new NextResponse("Missing videoUrl", { status: 401 });

  // Emulate slow transcribing process
  await new Promise((res) => setTimeout(res, 300));

  return NextResponse.json({
    videoUrl:
      "https://cdmdemo.contentdm.oclc.org/utils/getfile/collection/p15700coll2/id/7/filename/video1.ogg",
    captionsVtt,
  });
}
