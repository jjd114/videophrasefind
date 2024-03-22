"use client";

import { z } from "zod";
import { useEffect, useMemo, useRef } from "react";
import _ from "lodash";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";

import CaptionsEntry from "@/components/CaptionsEntry";
import Search from "@/components/Search";

import useZodForm from "@/hooks/useZodForm";

import { TranscriptionsSchema } from "@/twelveLabs/utils";

import useRefresher from "@/utils/useRefresher";
import { useThumbnailer, STEP } from "@/utils/thumbnailer";

import Loader from "@/app/video/[s3DirectoryPath]/loader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const schema = z.object({
  searchQuery: z.string(),
  semanticSearch: z.boolean(),
});

interface Props {
  data: TranscriptionsSchema | null;
  semanticSearchResult: Entry[];
  videoUrl: string | null;
  refreshInterval?: number;
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

const Content = ({
  data,
  semanticSearchResult,
  videoUrl,
  refreshInterval,
}: Props) => {
  useRefresher({ enabled: !(data && videoUrl), interval: refreshInterval });

  const searchParams = useSearchParams();

  console.log(searchParams.toString());

  const pathname = usePathname();

  const { replace } = useRouter();

  const { thumbnails } = useThumbnailer(videoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);

  console.log(searchParams.get("query"));

  const {
    watch,
    register,
    resetField,
    formState: { errors },
  } = useZodForm({
    schema,
    defaultValues: {
      searchQuery: "",
      semanticSearch: false,
    },
    mode: "onBlur",
  });

  const searchQuery = watch("searchQuery");
  const semanticSearch = watch("semanticSearch");

  // todo: rewrite/replace to Search onChange
  useEffect(() => {
    if (semanticSearch) {
      const params = new URLSearchParams(searchParams);

      if (searchQuery) {
        params.set("query", encodeURIComponent(searchQuery));
      } else {
        params.delete("query");
      }

      replace(`${pathname}?${params.toString()}`);
    }
  }, [searchQuery]);

  const filteredCaptions = useMemo(
    () =>
      data?.parsedCaptions.filter((entry) =>
        entry.text.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [data?.parsedCaptions, searchQuery],
  );

  if (!videoUrl)
    return (
      <Loader message="Waiting for the video. This may take a few minutes" />
    );

  return (
    <div className="grid flex-1 grid-cols-3 gap-10 overflow-hidden rounded-[32px] bg-[#212A36] p-10">
      <div className="col-span-2">
        <div className="rounded-2xl bg-[#ffffff1f] p-2">
          <video
            ref={videoRef}
            preload="auto"
            autoPlay
            muted
            controls
            className="max-h-fit w-full overflow-hidden rounded-xl"
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
      <div className="overflow-scrolls flex max-h-[800px] flex-col gap-5 rounded-[32px]">
        {data ? (
          <>
            <div className="flex items-center justify-center gap-3">
              <input
                id="semanticSearch"
                type="checkbox"
                defaultChecked={false}
                {...register("semanticSearch", {
                  onChange: (e) => {
                    if (!e.target.checked) {
                      replace(`${pathname}`);
                    }

                    resetField("searchQuery");
                  },
                })}
              />
              <label className="font-bold" htmlFor="semanticSearch">
                Semantic search
              </label>
            </div>
            <Search
              placeholder="Filter"
              name="searchQuery"
              register={register}
              errors={errors}
              defaultValue={searchParams.get("query")?.toString()}
            />
            <div className="text-base font-semibold text-white">
              {`Results: ${semanticSearch ? semanticSearchResult.length : filteredCaptions?.length || 0}`}
            </div>
            <div className="overflow-y-auto">
              {(semanticSearch ? semanticSearchResult : filteredCaptions)?.map(
                (entry) => {
                  return (
                    <CaptionsEntry
                      key={entry.from}
                      videoRef={videoRef}
                      entry={entry}
                      thumbnailSrc={
                        thumbnails[Math.floor(entry.from / (STEP * 1000))] ||
                        _.last(thumbnails)
                      }
                    />
                  );
                },
              )}
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
