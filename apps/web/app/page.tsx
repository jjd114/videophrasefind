import { type Metadata } from "next";

import VideoForm from "@/components/VideoForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Home - siftvid.io",
  description:
    "Here you can start use the main function of the app - transcribe a video and allow a user to quickly sift the results for any instance of a word or phrase",
};

export default function Root() {
  return (
    <section className="flex w-full items-center justify-center px-3 py-7 sm:px-7">
      <VideoForm />
    </section>
  );
}
