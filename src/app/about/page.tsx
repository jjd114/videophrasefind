import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <>
      <h2 className="text-center text-xl font-semibold sm:text-2xl">
        About the project
      </h2>
      <div className="flex flex-col gap-5 leading-7 sm:text-lg">
        <p className="text-justify">
          With video becoming the dominant form of media being consumed, we are
          building a robust engine to search and sift easily to deliver accurate
          results.
        </p>
        <p className="text-center ">
          Give us{" "}
          <Link className="underline" href="/contact">
            feedback
          </Link>{" "}
          or let us know how we can improve here!
        </p>
      </div>
      <section className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-scroll rounded-[32px] bg-[#0B111A] p-8 md:p-12">
        <div className="flex flex-1 flex-col gap-5 leading-7">
          <h2 className="text-2xl font-semibold md:text-4xl">Video search</h2>
          <div className="rounded-md bg-gradient-to-r from-purple-500/15 p-2">
            <div className="p-5 text-white/85 md:text-lg">
              <p>
                Search a video for keyword for phrase by pasting a link or
                uploading a movie file.
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold md:text-4xl">
            Search a Video with Ease
          </h2>
          <div className="flex flex-1 flex-col rounded-md bg-gradient-to-r from-purple-500/15 p-2">
            <div className="flex flex-1 flex-col justify-between gap-7 p-4 text-white/85 md:text-lg">
              <p>
                Our tool transcribes the video and allows a user to quickly sift
                the results for any instance of a word or phrase. Jump to the
                various instances of the word search quickly.
              </p>
              <p>
                This may be helpful to search interviews or recorded meetings.
                Scrubbing through hours of footage for a particular moment or
                spoken word is time-consuming. This tool is dedicated to solving
                that issue.
              </p>
              <p>
                Other use cases can be for news reels, documentary footage, or
                any video from YouTube that needs to be searched.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
