"use client";
import Form from "./Form";
import { z } from "zod";
import { parse } from "@plussub/srt-vtt-parser";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";

const ListElem = ({ data }: any) => {
  function msToTime(s: number) {
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return hrs + ":" + mins + ":" + secs;
  }
  return (
    <div className="p-2 flex items-center hover:bg-[#394150] rounded-[18px]">
      <div className="w-[121px] h-[90px] rounded-xl bg-[#ffffff1f] shrink-0"></div>
      <div className="ml-5">
        <div className="text-white text-xl font-semibold">{data.text}</div>
        <div className="text-base text-[#101824] flex justify-center items-center mt-5 w-[max-content] h-[28px] rounded-md bg-[#9DA3AE] px-2">
          {msToTime(data.from)}
        </div>
      </div>
      {/*<div className="ml-auto shrink-0">
        <Image
          className="cursor-pointer"
          src="/forward.svg"
          alt=""
          width="28"
          height="28"
        />
        <Image
          className="cursor-pointer mt-[18px]"
          src="/loop.svg"
          alt=""
          width="28"
          height="28"
        />
      </div>*/}
    </div>
  );
};

export const responseSchema = z.object({
  videoUrl: z.string().url(),
  captionsVtt: z.string().min(1),
});

const Content = () => {
  const { data, status, mutateAsync } = useMutation({
    mutationFn: async ({ videoUrl }: { videoUrl: string }) => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/mock-api/transcribe?videoUrl=${videoUrl}`,
      );
      const json = responseSchema.parse(await res.json());
      const { entries } = parse(json.captionsVtt);
      return { ...json, parsedCaptions: entries };
    },
  });

  return (
    <div className="flex w-full">
      <Form onSubmit={(v) => mutateAsync(v)} />
      {status === "pending" ? (
        <div className="m-auto flex align-center">
          <Image
            className="cursor-pointer mt-[18px] animate-spin"
            src="/spinner.svg"
            alt=""
            width="120"
            height="120"
          />
        </div>
      ) : (
        status === "success" &&
        data && (
          <div className="py-6 px-10 bg-[#212A36] h-full w-[100%] max-w-[627px] ml-auto">
            <div className="text-white text-xl font-semibold h-[48px]">
              Results: {data.parsedCaptions.length}
            </div>
            <div className="ml-3 w-[100%] h-[379px] rounded-[20px] bg-[#ffffff1f] mt-3 overflow-hidden">
              {data.videoUrl && (
                <video
                  style={{ width: "100%", height: "100%" }}
                  preload="auto"
                  controls
                >
                  <source src={data.videoUrl} type="application/ogg" />
                  <track
                    label="English"
                    kind="subtitles"
                    srcLang="en"
                    src={`data:text/vtt;charset=UTF-8,${encodeURIComponent(
                      data.captionsVtt,
                    )}`}
                    default
                  />
                </video>
              )}
            </div>
            <div className="w-[100%] h-[420px] mt-5 overflow-auto">
              {data.parsedCaptions.map((result: any) => {
                return <ListElem key={result.text} data={result} />;
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Content;
