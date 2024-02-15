import Form from "@/app/components/Form";

export default function Root() {
  return (
    <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-9">
      <section className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-semibold">Features</h2>
        <p className="text-justify indent-8 leading-7">
          <strong>Video search</strong> - search a video for keyword for phrase
          by pasting a link or uploading a movie file.
        </p>
        <p className="indent-8 leading-7">
          <strong>Search a Video with Ease</strong>
        </p>
        <p className="text-justify indent-8 leading-7 ">
          Our tool transcribes the video and allows a user to quickly sift the
          results for any instance of a word or phrase. Jump to the various
          instances of the word search quickly.
        </p>
        <p className="text-justify indent-8 leading-7 ">
          This may be helpful to search interviews or recorded meetings.
          Scrubbing through hours of footage for a particular moment or spoken
          word is time-consuming. This tool is dedicated to solving that issue.
        </p>
        <p className="text-justify indent-8 leading-7 ">
          Other use cases can be for news reels, documentary footage, or any
          video from YouTube that needs to be searched.
        </p>
      </section>
      <section className="flex justify-end">
        <Form />
      </section>
    </div>
  );
}
