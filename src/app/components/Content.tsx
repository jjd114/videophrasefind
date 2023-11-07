"use client"
import { useEventListener } from "../hooks/useEventListener";
import { useRef, useEffect, useState } from "react";
import Form from "./Form";

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

const Content = ({ request }: any) => {

    const [data, setData]: [any, any] = useState({});
    
    const onClick = () => {
        alert('click');
    }

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEventListener('click', onClick, buttonRef.current!);

    useEffect(() => {
        console.log('data');
        console.log(data);
    }, [data]);
    

    /*useEffect(() => {
        const onClick = () => {
            let video = document.getElementById("video");
            if (video) {
                video.currentTime = 5;
            }
        }
        const onUpdate = () => {
            let video = document.getElementById("video");
            let canvas = document.getElementById("canvas");
            if (video && canvas) {
                canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }
        }
        if (document) {
            document.getElementById("capture").addEventListener("click", onClick);
            document.getElementById("video").addEventListener("timeupdate", onUpdate);
        }
    }, []);*/
    return (
        <div className="flex w-full">
            <Form data={data} setData={setData} request={request} />
            <div className="py-6 px-10 bg-[#212A36] h-full w-[100%] max-w-[627px] ml-auto">
                <div
                    className="text-white text-xl font-semibold h-[48px]"
                >
                    Results:  1000
                </div>
                <div className="ml-3 w-[100%] h-[379px] rounded-[20px] bg-[#ffffff1f] mt-3">
                    {data.videoUrl && <video style={{ width: "100%", height: "100%" }} controls>
                        <source src={data.videoUrl} type="video/mp4" />
                        <track
                            label="English"
                            kind="subtitles"
                            srcLang="en"
                            src={`data:text/vtt;charset=UTF-8,${encodeURIComponent(data.captionsVtt)}`}
                            default
                        />
                    </video>}
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
        </div>
    );
  };
  
  export default Content;