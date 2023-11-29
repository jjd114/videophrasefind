"use client";
import { useDropzone, FileWithPath } from "react-dropzone";
import useZodForm from "../hooks/useZodForm";
import { z } from "zod";
import Button from "./Button";
import Input from "./Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { getUploadUrl, triggerVideoTranscription } from "../actions";
import { useMutation } from "@tanstack/react-query";

export const schema = z.object({
  videoUrl: z
    .string()
    .url()
    .transform((s) => s.replaceAll(/&.*$/g, "")) // Cleanup youtube links
    .or(z.literal("")),
});

export default function Form() {
  const router = useRouter();
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

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const { uploadUrl, s3Path, downloadUrl } = await getUploadUrl();

      await fetch(uploadUrl, {
        method: "PUT",
        body: acceptedFiles[0],
      });

      return { s3Path, videoUrl: downloadUrl };
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    const { videoUrl, s3Path } = formData.videoUrl
      ? {
          videoUrl: formData.videoUrl,
          s3Path: encodeURIComponent(formData.videoUrl),
        }
      : await uploadMutation.mutateAsync();

    console.log({ videoUrl, s3Path });
    await triggerVideoTranscription(videoUrl);

    startTransition(() => {
      router.push(`/video/${s3Path}`);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="min-w-[512px] flex flex-col gap-8 items-center bg-[#0B111A] p-4 rounded-[32px]"
    >
      <section className="w-full h-full">
        <div
          {...getRootProps({
            className:
              "dropzone w-full h-full aspect-[4/3] border-dashed border-[#212A36] border-[1px] rounded-[32px] bg-[#212A361A] cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image
              className="mb-5"
              src="/upload.svg"
              alt=""
              width="25"
              height="25"
            />
            {!files.length ? (
              <p className="text-center text-[#9DA3AE] font-semibold">
                Drag & Drop or <span className="text-white">Choose video</span>
                <br />
                to upload
              </p>
            ) : (
              <p className="text-[#9DA3AE] text-center text-[#9DA3AE]-500">
                {files}
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="flex items-center w-full">
        <div className="border-b-[1px] border-[#212A36] flex-1"></div>
        <div className="px-[27px] text-[#9DA3AE] text-base font-medium">or</div>
        <div className="border-b-[1px] border-[#212A36] flex-1"></div>
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
