import Form from "@/app/components/Form";

export default function Root() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex size-full max-w-screen-2xl gap-4 p-5 max-[1050px]:flex-col min-[1050px]:max-h-[calc(678px+2*theme(padding.5))]">
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
                  Our tool transcribes the video and allows a user to quickly
                  sift the results for any instance of a word or phrase. Jump to
                  the various instances of the word search quickly.
                </p>
                <p>
                  This may be helpful to search interviews or recorded meetings.
                  Scrubbing through hours of footage for a particular moment or
                  spoken word is time-consuming. This tool is dedicated to
                  solving that issue.
                </p>
                <p>
                  Other use cases can be for news reels, documentary footage, or
                  any video from YouTube that needs to be searched.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Form />
      </div>
    </div>
  );
}
