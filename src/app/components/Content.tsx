"use client";
import { z } from "zod";
import Search from "./Search";
import useZodForm from "../hooks/useZodForm";
import { RefObject, useMemo, useRef } from "react";
import _ from "lodash";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";
import { intervalToDuration } from "date-fns";
import { JsonSchema } from "../utils/json.schema";
import { STEP, useThumbnailer } from "../utils/thumbnailer";
import Loader from "../video/[...s3DirectoryPath]/loader";

export const schema = z.object({
  searchQuery: z.string(),
});

function padTime(time?: number) {
  return _.padStart(time?.toFixed(0), 2, "0");
}

function formatMilliseconds(ms: number) {
  const duration = intervalToDuration({
    start: 0,
    end: ms,
  });
  return `${padTime(duration?.hours)}:${padTime(duration?.minutes)}:${padTime(
    duration?.seconds,
  )}`;
}

const CaptionsEntry = ({
  entry,
  videoRef,
  thumbnailSrc,
}: {
  entry: Entry;
  videoRef: RefObject<HTMLVideoElement>;
  thumbnailSrc?: string;
}) => {
  const handleClick = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = entry.from / 1000;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 flex gap-5 hover:bg-[#394150] rounded-[18px] overflow-hidden mb-2 w-full"
    >
      <div className="h-16 aspect-video rounded-xl bg-[#ffffff1f] relative">
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            className="w-full max-h-fit rounded-xl overflow-hidden"
            alt=""
          />
        )}
      </div>
      <div className="flex flex-col gap-1 text-left text-sm">
        <div className="text-white font-semibold overflow-hidden overflow-ellipsis grow">
          {entry.text}
        </div>
        <div className="text-[#101824] flex justify-center items-center w-[max-content] rounded-md bg-[#9DA3AE] px-2">
          {formatMilliseconds(entry.from)}
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
    </button>
  );
};

interface Props {
  data: JsonSchema | null;
  videoUrl: string | null;
}

const Content = ({ data, videoUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    watch,
    register,
    formState: { errors },
  } = useZodForm({
    schema,
    defaultValues: {
      searchQuery: "",
    },
    mode: "onBlur",
  });

  const { thumbnails } = useThumbnailer(videoUrl);

  const searchQuery = watch("searchQuery");

  const filteredCaptions = useMemo(
    () =>
      data?.parsedCaptions.filter((entry) =>
        entry.text.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [data?.parsedCaptions, searchQuery],
  );

  if (!videoUrl) return <Loader />;

  return (
    <div className="flex-1 grid grid-cols-3 gap-10 bg-[#212A36] rounded-3xl overflow-hidden p-10">
      <div className="col-span-2">
        <div className="bg-[#ffffff1f] rounded-2xl p-2">
          <video
            ref={videoRef}
            preload="auto"
            autoPlay
            muted
            controls
            className="w-full max-h-fit rounded-xl overflow-hidden"
          >
            <source src={videoUrl} type="application/ogg" />
            {data && (
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={`data:text/vtt;charset=UTF-8,${encodeURIComponent(
                  data.captionsVtt,
                )}`}
                default
              />
            )}
          </video>
        </div>
      </div>
      <div className="rounded-[32px] flex flex-col gap-5 overflow-hidden">
        {data ? (
          <>
            <Search
              placeholder="Filter"
              name="searchQuery"
              register={register}
              errors={errors}
            />
            <div className="text-white text-base font-semibold">
              Results: {filteredCaptions?.length || 0}
            </div>
            <div className="overflow-y-auto">
              {filteredCaptions?.map((entry) => {
                return (
                  <CaptionsEntry
                    key={entry.from}
                    entry={entry}
                    videoRef={videoRef}
                    thumbnailSrc={
                      thumbnails[Math.floor(entry.from / (STEP * 1000))] ||
                      _.last(thumbnails)
                    }
                  />
                );
              })}
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Content;
