"use client";

import { z } from "zod";

import useZodForm from "@/app/hooks/useZodForm";

import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useZodForm({
    schema: contactSchema,
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit((data: z.infer<typeof contactSchema>) => {
        console.log(data);
      })}
    >
      <Input
        required
        placeholder="your name"
        name="name"
        label="What is your name?"
        errors={errors}
        register={register}
      />
      <Input
        required
        placeholder="your email"
        name="email"
        label="Contact email"
        errors={errors}
        register={register}
      />
      <Input
        required
        placeholder="subject"
        name="subject"
        label="What is your question about?"
        errors={errors}
        register={register}
      />
      <div className="grid gap-2">
        <label htmlFor="description">
          Describe in detail your problem or proposition*
        </label>
        <textarea
          rows={7}
          className="placeholder:text-[#9DA3AE]-500 resize-none rounded-[32px] border border-[#212A36] bg-transparent px-5 py-3 text-[#9DA3AE]"
          placeholder="description"
          id="description"
          {...register("description")}
        />
        {errors.description && (
          <p className="mx-5 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>
      <Button disabled={!isDirty || !isValid || isSubmitting}>
        Submit a request
      </Button>
    </form>
  );
}
