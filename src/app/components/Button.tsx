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
        disbled:text-[#9DA3AE] relative flex w-full
        cursor-pointer items-center justify-center whitespace-nowrap
        rounded-[32px] bg-slate-100 px-12
        py-[10px] text-xl font-semibold text-slate-700 disabled:bg-[#212A36]
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
