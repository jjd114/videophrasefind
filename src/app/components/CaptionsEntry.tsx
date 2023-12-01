import _ from "lodash";
import { intervalToDuration } from "date-fns";
import { Entry } from "@plussub/srt-vtt-parser/dist/src/types";
import { RefObject } from "react";

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

export default function CaptionsEntry({
  entry,
  videoRef,
  thumbnailSrc,
}: {
  entry: Entry;
  videoRef: RefObject<HTMLVideoElement>;
  thumbnailSrc?: string;
}) {
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
    </button>
  );
}
