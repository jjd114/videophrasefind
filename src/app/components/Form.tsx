"use client";
import { useDropzone, FileWithPath } from "react-dropzone";
import useZodForm from "../hooks/useZodForm";
import { z } from "zod";
import Button from "./Button";
import Input from "./Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const schema = z.object({
  videoUrl: z.string().url(),
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

  const onSubmit = handleSubmit((formData) => {
    // TODO: upload video and get URL if needed
    startTransition(() => {
      router.push(`/video/${encodeURIComponent(formData.videoUrl)}`);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="min-w-[512px] flex flex-col gap-8 items-center bg-[#0B111A] p-4 rounded-[32px]"
    >
      <section className="w-full border-dashed border-[#212A36] border-[1px] rounded-[32px] bg-[#212A361A] aspect-[4/3] cursor-pointer">
        <div {...getRootProps({ className: "dropzone w-full h-full" })}>
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
        {/*<aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>*/}
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
        disabled={!isValid || !isDirty || isSubmitting || isPending}
      >
        Submit
      </Button>
    </form>
  );
}
