import { useDropzone, FileWithPath } from 'react-dropzone';
import useZodForm from "../hooks/useZodForm";
import { z } from "zod";
import Button from "./Button";
import Input from "./Input";
import { SubmitHandler } from "react-hook-form";
import Image from "next/image";

export const schema = z.object({
  videoUrl: z.string().url(),
});

interface Props {
  onSubmit: SubmitHandler<z.infer<typeof schema>>;
  status: string;
}

export default function Form({ onSubmit, status }: Props) {
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

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center paper bg-[#0B111A] h-full w-full p-4 rounded-[32px] ml-[10px]"
    >
      {status === "pending" ? (
        <div className="m-auto flex align-center">
          <Image
            className="cursor-pointer mt-[18px] animate-spin"
            src="/loading.svg"
            alt=""
            width="77"
            height="77"
          />
        </div>
      ) : (
        <div className="max-w-[390px] ml-auto mr-auto">
          <section
            className="w-full border-dashed border-[#212A36] border-[1px] rounded-[32px] bg-[#212A361A] h-[300px] mb-5"
          >
            <div {...getRootProps({className: 'dropzone w-full h-full'})}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Image
                  className="cursor-pointer mb-5 ml-auto mr-auto"
                  src="/upload.svg"
                  alt=""
                  width="25"
                  height="25"
                />
                {!files.length ?
                <p className="text-[#9DA3AE] text-center text-[#9DA3AE] font-semibold">
                  Drag & Drop or <span className="text-white">Choose video</span><br/>to upload
                </p>
                : 
                <p className="text-[#9DA3AE] text-center text-[#9DA3AE]-500">
                  {files}
                </p>}
              </div>
            </div>
            {/*<aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>*/}
          </section>
          <div className="flex items-center mb-5">
            <div className="border-b-[1px] border-[#212A36] w-full"></div>
            <div className="px-[27px] text-[#9DA3AE] text-base font-medium">or</div>
            <div className="border-b-[1px] border-[#212A36] w-full"></div>
          </div>
          <Input
            placeholder="Add video URL"
            name="videoUrl"
            register={register}
            errors={errors}
          />
          <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
            Submit
          </Button>
        </div>)}
    </form>
  );
}
