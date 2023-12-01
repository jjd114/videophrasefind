"use client";
import { z } from "zod";
import Search from "./Search";
import useZodForm from "../hooks/useZodForm";
import { useMemo, useRef } from "react";
import _ from "lodash";
import { JsonSchema } from "../utils/json.schema";
import { STEP, useThumbnailer } from "../utils/thumbnailer";
import Loader from "../video/[...s3DirectoryPath]/loader";
import useRefresher from "../utils/useRefresher";
import CaptionsEntry from "./CaptionsEntry";

export const schema = z.object({
  searchQuery: z.string(),
});

interface Props {
  data: JsonSchema | null;
  videoUrl: string | null;
}

function getLoaderMessage(videoDurationSeconds?: number) {
  if (!videoDurationSeconds) return "Waiting for transcription results.";
  if (videoDurationSeconds < 60 * 5)
    return "Waiting for transcription results, it's gonna take a minute or two";
  if (videoDurationSeconds < 60 * 10)
    return "Waiting for transcription results, it may take up to 5 minutes";
  if (videoDurationSeconds < 60 * 30)
    return "Waiting for transcription results, it may take up to 15 minutes. You can save this link and come back later!";
  return "Waiting for transcription results. Your video is pretty large, it make take some time (up to half of the video duration). You can save this link and come back later!";
}

const Content = ({ data, videoUrl }: Props) => {
  useRefresher({ enabled: !(data && videoUrl) });

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

  if (!videoUrl)
    return (
      <Loader message="Waiting for the video. This can take up to 5 minutes" />
    );

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
          <Loader message={getLoaderMessage(videoRef.current?.duration)} />
        )}
      </div>
    </div>
  );
};

export default Content;
