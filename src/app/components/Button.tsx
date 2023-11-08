import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="submit"
      className={`
        px-12 py-3 sm:w-fit w-full rounded-full
        flex items-center justify-center relative
        whitespace-nowrap font-bold text-md
        disabled:cursor-not-allowed
        disabled:bg-gray-400
        bg-black
        text-white uppercase
        ${isLoading ? "cursor-progress" : ""}
        ${variant === "primary" ? "bg-primary" : ""}
        ${variant === "secondary" ? "bg-secondary" : ""}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
