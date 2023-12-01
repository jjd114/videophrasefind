import Image from "next/image";

export default function Loader({ message }: { message?: string }) {
  return (
    <div className="m-auto flex flex-col items-center gap-8 align-center">
      <Image
        className="cursor-pointer mt-[18px] animate-spin"
        src="/loading.svg"
        alt=""
        width="77"
        height="77"
      />
      {message && <span className="text-center">{message}</span>}
    </div>
  );
}
