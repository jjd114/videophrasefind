"use client";

import { z } from "zod";

import useZodForm from "@/app/hooks/useZodForm";

import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { TextArea } from "@/app/components/TextArea";

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
    mode: "onBlur",
  });

  return (
    <form
      className="flex flex-1 flex-col gap-4"
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
      <TextArea
        required
        name="description"
        label="Describe in detail your problem or proposition"
        placeholder="description"
        errors={errors}
        register={register}
      />
      <Button disabled={!isDirty || !isValid || isSubmitting}>
        Submit a request
      </Button>
    </form>
  );
}
