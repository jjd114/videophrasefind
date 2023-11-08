import useZodForm from "../hooks/useZodForm";
import { z } from "zod";
import Button from "./Button";
import Input from "./Input";
import { SubmitHandler } from "react-hook-form";

export const schema = z.object({
  videoUrl: z.string().url(),
  query: z.string().min(1, "Please enter search query"),
});

interface Props {
  onSubmit: SubmitHandler<z.infer<typeof schema>>;
}

export default function Form({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema,
    defaultValues: {
      videoUrl: "",
      query: "",
    },
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col paper bg-[#F0F0F0] h-max w-80 p-4 rounded-2xl ml-10 mt-10"
    >
      <Input
        placeholder="Video url"
        name="videoUrl"
        register={register}
        errors={errors}
      />
      <Input
        placeholder="Search query"
        name="query"
        register={register}
        errors={errors}
      />
      <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
