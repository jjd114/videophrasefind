"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Loader() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: exponential backoff?
      console.log("Refetching");
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="m-auto flex align-center">
      <Image
        className="cursor-pointer mt-[18px] animate-spin"
        src="/loading.svg"
        alt=""
        width="77"
        height="77"
      />
    </div>
  );
}
