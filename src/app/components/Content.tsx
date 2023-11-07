"use client"
import { useEventListener } from "../hooks/useEventListener";
import { useEffect, useState } from "react";

const ListElem = () => {
    return (
        <div className="p-2 flex items-center">
            <div className="w-[121px] h-[90px] rounded-xl bg-[#ffffff1f]">
            </div>
            <div className="ml-5">
                <div className="text-white text-xl font-semibold">
                    The evolution of the human
                </div>
                <div className="text-base text-[#101824] flex justify-center items-center mt-5 w-[52px] h-[28px] rounded-md bg-[#9DA3AE]">
                    0:00
                </div>
            </div>
        </div>
    );
}

const Content = ({ data }: any) => {
    const onClick = () => {
        alert('click');
    }
    return (
        <div className="py-6 px-10 bg-[#212A36] h-full w-[100%] max-w-[627px]">
            <div
                className="text-white text-xl font-semibold h-[48px]"
                id="button"
            >
                Results:  1000
            </div>
            <div className="ml-3 w-[100%] h-[379px] rounded-[20px] bg-[#ffffff1f] mt-3">
                <video style={{ width: "100%", height: "100%" }}>
                    <source src={data.videoUrl} />
                    <track
                        label="English"
                        kind="subtitles"
                        srcLang="en"
                        src={`data:text/vtt;charset=UTF-8,${encodeURIComponent(data.captionsVtt)}`}
                        default
                    />
                </video>
            </div>
            <div className="w-[100%] h-[420px] mt-5 overflow-auto">
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
                <ListElem />
            </div>
        </div>
    );
  };
  
  export default Content;