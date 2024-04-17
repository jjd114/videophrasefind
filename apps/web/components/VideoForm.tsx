"use client";

import { useDropzone, FileWithPath } from "react-dropzone";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import useZodForm from "@/hooks/useZodForm";

import Button from "@/components/Button";
import Input from "@/components/Input";

import { fetchAndTrigger, getUploadUrl, trigger } from "@/app/actions";
import { saveVideo } from "@/app/video-actions";

import { Icons } from "./Icons";

export const schema = z.object({
  videoUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .transform((s) => s.replaceAll(/&.*$/g, "")) // Cleanup youtube links
    .or(z.literal("")),
});

export default function VideoForm() {
  const router = useRouter();

  const [status, setStatus] = useState("no status");

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
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

  const localUploadMutation = useMutation({
    onMutate: () => {
      setStatus("uploading your video to our storage...");
    },
    mutationFn: async ({ file }: { file: File }) => {
      const { uploadUrl, s3Directory, downloadUrl } = await getUploadUrl();

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      // Trigger video transcription manually
      await trigger(downloadUrl, s3Directory);

      return { s3Directory, videoTitle: file.name.split(".")[0] };
    },
  });

  const externalUploadMutation = useMutation({
    onMutate: () => {
      setStatus("triggering video upload to our storage...");
    },
    mutationFn: ({ url }: { url: string }) => fetchAndTrigger(url), // Video transcription will be triggered automatically
  });

  const saveVideoMutation = useMutation({
    onMutate: () => {
      setStatus("triggering save video metadata job...");
    },
    mutationFn: (data: { videoTitle: string; indexName: string }) =>
      saveVideo({ videoTitle: data.videoTitle, indexName: data.indexName }),
  });

  if (isSubmitting || isPending)
    return (
      <div className="flex w-full max-w-[512px] flex-col items-center gap-4">
        <Icons.spinner className="size-20 animate-spin text-[#9DA3AE]" />
        <div className="text-center">
          <h2 className="mb-4 text-lg font-bold">Video processing...</h2>
          <p className="text-md animate-slide text-center text-[#9DA3AE]">
            {status}
          </p>
        </div>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(async ({ videoUrl }) => {
        const { s3Directory, videoTitle } = videoUrl
          ? await externalUploadMutation.mutateAsync({ url: videoUrl })
          : await localUploadMutation.mutateAsync({ file: acceptedFiles[0] });

        const videoId = await saveVideoMutation.mutateAsync({
          indexName: s3Directory,
          videoTitle,
        });

        // If I do redirect on the server side -> redirect time is not included in the mutation isPending time
        startTransition(() => {
          router.push(`/video/${videoId}`);
        });
      })}
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
          localUploadMutation.isPending ||
          !isValid ||
          (!isDirty && acceptedFiles.length === 0)
        }
      >
        Submit
      </Button>
    </form>
  );
}
