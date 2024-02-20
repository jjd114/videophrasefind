import { type Metadata } from "next";

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
  title: "Help",
};

export default function Help() {
  return (
    <>
      <h2 className="text-center text-xl font-medium sm:text-2xl">
        How to use the app?
      </h2>
      <ul className="flex flex-col items-center gap-5 sm:text-lg">
        {steps.map((step, index) => (
          <li
            key={index + 1}
            className="flex w-full flex-col justify-center gap-[42px] rounded-[32px] bg-[#0B111A] p-5 sm:p-8"
          >
            <div className="flex items-center gap-5">
              <span className="inline-flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 font-semibold">
                {index + 1}
              </span>
              <h3>{step.text}</h3>
            </div>
            {step.img && (
              <div className="flex min-h-[435px] w-full items-center justify-center rounded-2xl border border-[#212A36] bg-[#0D131C]">
                Image will be here
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
