// import Image from "next/image";

import { type Metadata } from "next";
import Link from "next/link";

const steps: {
  text: string;
  img?: string;
}[] = [
  {
    text: "Navigate to https://videophrasefind.com",
  },
  {
    text: `Click the "Paste video URL" input`,
    img: "/favicon.ico",
  },
  {
    text: `Paste the result`,
  },
  {
    text: `Click "Drag & Drop" or Choose video to upload`,
    img: "/favicon.ico",
  },
  {
    text: `Click "Drag & Drop" or Choose video to upload`,
    img: "/favicon.ico",
  },
  {
    text: `Click "Submit"`,
    img: "/favicon.ico",
  },
  {
    text: `Click the "Filter" field`,
    img: "/favicon.ico",
  },
  {
    text: "Enter Keyword Search",
  },
  {
    text: "Double-click on keyword instance to jump to",
    img: "/favicon.ico",
  },
];

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="flex w-full max-w-[935px] flex-col gap-7">
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
      <h2 className="text-center text-xl font-semibold sm:text-2xl">
        How to use the app?
      </h2>
      <ul className="flex flex-col items-center gap-8 sm:text-lg">
        {steps.map((step, index) => (
          <li
            key={index + 1}
            className="flex w-full max-w-[900px] flex-col justify-center gap-7 rounded-2xl border-b-[5px] border-b-slate-600 bg-slate-800 p-5 sm:p-8"
          >
            <div className="flex items-center gap-5">
              <span className="inline-flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-300 font-bold text-purple-800">
                {index + 1}
              </span>
              <h3 className="font-medium">{step.text}</h3>
            </div>
            {step.img && (
              <div className="flex min-h-[400px] w-full items-center justify-center rounded-lg bg-slate-700">
                Image will be here
                {/* <Image
                  src="/favicon.ico"
                  width={500}
                  height={500}
                  alt="Image describing step"
                /> */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
