"use client";

import { useDropzone, FileWithPath } from "react-dropzone";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import useZodForm from "@/app/hooks/useZodForm";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

import {
  getUploadUrl,
  getVideoUrl,
  triggerVideoTranscription,
} from "@/app/actions";
import {
  getTaskStatus,
  trigger12LabsVideoUpload,
  getTaskData,
  getTaskVideoId,
} from "@/app/twelveLabs/actions";

import Loader from "@/app/video/[...s3DirectoryPath]/loader";

export const schema = z.object({
  videoUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .transform((s) => s.replaceAll(/&.*$/g, "")) // Cleanup youtube links
    .or(z.literal("")),
});

export default function VideoForm() {
  const router = useRouter();

  const [taskStatus12Labs, setTaskStatus12Labs] = useState("no status");

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitted, isDirty },
  } = useZodForm({
    schema,
    defaultValues: {
      videoUrl: "",
    },
    mode: "onBlur",
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { uploadUrl, s3Directory, downloadUrl } = await getUploadUrl();

      await fetch(uploadUrl, {
        method: "PUT",
        body: acceptedFiles[0],
      });

      return { s3Directory, videoUrl: downloadUrl };
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    const waitForVideoTranscriptionsReady = async (taskId: string) => {
      let status = await getTaskStatus(taskId);

      while (status !== "ready") {
        status = await getTaskStatus(taskId);

        console.log(status);

        setTaskStatus12Labs(status);

        await new Promise((res) => setTimeout(res, 1000));
      }
    };

    const waitForUploadOn12LabsReady = async (indexId: string) => {
      let data = await getTaskData(indexId);

      while (data.length === 0) {
        data = await getTaskData(indexId);

        console.log(data);

        await new Promise((res) => setTimeout(res, 500));
      }

      return data[0]._id;
    };

    const localUpload = async () => {
      console.log("video uploading to s3 started");
      const mutationResponse = await uploadMutation.mutateAsync();
      console.log("video uploading to s3 finished");

      const indexId = await trigger12LabsVideoUpload(mutationResponse.videoUrl);
      console.log("indexId: " + indexId);
      setTaskStatus12Labs("upload video on 12 labs");

      const taskId = await waitForUploadOn12LabsReady(indexId);
      console.log("taskId: " + taskId);

      await waitForVideoTranscriptionsReady(taskId);

      const videoId = await getTaskVideoId(taskId);

      return {
        videoId: videoId,
        indexId,
        s3Directory: mutationResponse.s3Directory, // s3Directory: uuid
      };
    };

    // const videoUrlUpload = async () => {
    //   const triggerRes = await triggerVideoTranscription(formData.videoUrl); // to upload video to s3 bucket in our case
    //   console.log("video uploading to s3 started: " + triggerRes);

    //   const url = await getVideoUrl(encodeURIComponent(formData.videoUrl));

    //   const s3BucketVideoUrl = url ? url : "todo:? polling() implementation";
    //   console.log("video uploading to s3 finished");

    //   const taskId = await uploadVideoOn12Labs(s3BucketVideoUrl);

    //   const videoId = await waitForVideoTranscriptionsReady(taskId);

    //   return {
    //     videoId,
    //     s3Directory: encodeURIComponent(formData.videoUrl), // s3Directory: encodeURIComponent(youtube-link)
    //   };
    // };

    const { videoId, indexId, s3Directory } = await localUpload();

    console.log(videoId, s3Directory);

    startTransition(() => {
      router.push(
        `/video/${s3Directory}?videoId=${videoId}&indexId=${indexId}`,
      );
    });
  });

  if (uploadMutation.isPending)
    return (
      <div className="flex w-full max-w-[512px]">
        <Loader message="Uploading your video" />
      </div>
    );

  if (isSubmitting || isPending)
    return (
      <div className="flex w-full max-w-[512px]">
        <Loader message={`Video processing.. status=${taskStatus12Labs}`} />
      </div>
    );

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-center gap-8 rounded-[32px] bg-[#0B111A] p-4 min-[1050px]:max-w-[512px]"
    >
      <section className="size-full">
        <div
          {...getRootProps({
            className:
              "dropzone w-full h-full aspect-[4/3] border-dashed border-[#212A36] border-[1px] rounded-[32px] bg-[#212A361A] cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Image
              className="mb-5"
              src="/upload.svg"
              alt=""
              width="25"
              height="25"
            />
            {!files.length ? (
              <p className="text-center font-semibold text-[#9DA3AE]">
                Drag & Drop or <span className="text-white">Choose video</span>
                <br />
                to upload
              </p>
            ) : (
              <p className="text-[#9DA3AE]-500 text-center text-[#9DA3AE]">
                {files}
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="flex w-full items-center">
        <div className="flex-1 border-b border-[#212A36]"></div>
        <div className="px-[27px] text-base font-medium text-[#9DA3AE]">or</div>
        <div className="flex-1 border-b border-[#212A36]"></div>
      </div>
      <Input
        className="w-full"
        placeholder="Paste video URL"
        name="videoUrl"
        register={register}
        errors={errors}
      />
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          isPending ||
          uploadMutation.isPending ||
          !isValid ||
          (!isDirty && acceptedFiles.length === 0)
        }
      >
        Submit
      </Button>
    </form>
  );
}
