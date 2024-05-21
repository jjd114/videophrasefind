"use client";

import { useFormStatus } from "react-dom";

import Button from "@/components/Button";

export function CheckoutButton() {
  const status = useFormStatus();

  return (
    <Button isLoading={status.pending} disabled={status.pending}>
      {`${status.pending ? "Loading..." : "Get Started"}`}
    </Button>
  );
}
