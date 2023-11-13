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
        px-12 py-[10px] w-full rounded-[32px]
        flex items-center justify-center relative
        whitespace-nowrap font-semibold text-xl
        bg-[#212A36] text-[#9DA3AE] cursor-pointer
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
