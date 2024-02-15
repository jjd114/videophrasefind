// import Image from "next/image";

import { type Metadata } from "next";

const steps: {
  text: string;
  img?: string;
}[] = [
  {
    text: "Navigate to https://videophrasefind.com/",
    img: "/favicon.ico",
  },
  {
    text: `Click the "Paste video URL" input`,
  },
  {
    text: `Press ctrl + v`,
    img: "/favicon.ico",
  },
  {
    text: `Click "Drag & Drop" or Choose video to upload`,
  },
  {
    text: `Click "Drag & Drop" or Choose video to upload`,
    img: "/favicon.ico",
  },
  {
    text: `Click "Submit"`,
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
  },
];

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center text-2xl font-semibold">About the project</h2>
      <p className="indent-8">
        With video becoming the dominant form of media being consumed, we are
        building a robust engine to search and sift easily to deliver accurate
        results. Give us feedback or let us know how we can improve here.
      </p>
      <h2 className="text-center text-2xl font-semibold">
        How to find and filter video phrases on VideoPhraseFind?
      </h2>
      <ul className="flex flex-col items-center gap-8">
        {steps.map((step, index) => (
          <li
            key={index + 1}
            className="flex w-full max-w-[1000px] flex-col gap-7 rounded-2xl border-b-[5px] border-b-slate-600 bg-slate-800 p-8"
          >
            <div className="flex items-center gap-5">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-sky-300 font-bold text-sky-700">
                {index + 1}
              </span>
              <h3 className="font-medium">{step.text}</h3>
            </div>
            {step.img && (
              <div className="flex min-h-[525px] w-full items-center justify-center rounded-lg bg-slate-700">
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
