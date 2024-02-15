import Form from "@/app/components/Form";

export default function Root() {
  return (
    <div className="flex size-full h-[calc(100vh-70px-40px)] gap-4">
      <section className="flex flex-1 flex-col gap-4 overflow-scroll rounded-[32px] bg-[#0B111A] p-12">
        <h1 className="text-4xl font-bold">FEATURES</h1>
        <div className="flex gap-4 bg-gradient-to-r from-purple-500/10">
          <div className="h-full w-[9px] rounded-full bg-purple-600"></div>
          <text className="flex flex-col gap-5 text-justify text-lg leading-7">
            <p>
              <strong>Video search</strong> - search a video for keyword for
              phrase by pasting a link or uploading a movie file.
            </p>
            <p>
              <strong>Search a Video with Ease</strong>
            </p>
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
              Other use cases can be for news reels, documentary footage, or any
              video from YouTube that needs to be searched.
            </p>
          </text>
        </div>
      </section>
      <Form />
    </div>
  );
}
