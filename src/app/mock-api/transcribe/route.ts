import { NextRequest, NextResponse } from "next/server";

const captionsVtt =
  "WEBVTT\n\
00:01.000 --> 00:04.000\n\
- Never drink liquid nitrogen.\n\
\n\
00:05.000 --> 00:09.000\n\
- It will perforate your stomach.\n\
- You could die.";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("query");
  if (!query) return new NextResponse("Missing query", { status: 400 });

  const videoUrl = searchParams.get("videoUrl");
  if (!videoUrl) return new NextResponse("Missing videoUrl", { status: 401 });

  return NextResponse.json({
    videoUrl:
      "https://cdmdemo.contentdm.oclc.org/utils/getfile/collection/p15700coll2/id/7/filename/video1.ogg",
    captionsVtt,
  });
}
