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
    </>
  );
}
