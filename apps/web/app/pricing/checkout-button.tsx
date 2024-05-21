"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function CheckoutButton() {
  const status = useFormStatus();

  return (
    <Button className="size-full" disabled={status.pending}>
      {`${status.pending ? "Loading..." : "Get Started"}`}
    </Button>
  );
}
