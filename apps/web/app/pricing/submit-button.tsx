"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

export function SubmitButton({
  text,
  disabled = false,
}: {
  text: string;
  disabled?: boolean;
}) {
  const status = useFormStatus();

  return (
    <Button className="size-full" disabled={status.pending || disabled}>
      {status.pending ? (
        <span className="flex items-center gap-2">
          <span>Loading</span>
          <Icons.spinner className="size-4 animate-spin" />
        </span>
      ) : (
        text
      )}
    </Button>
  );
}
