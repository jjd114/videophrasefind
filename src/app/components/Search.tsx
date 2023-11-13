import _ from "lodash";
import { type InputHTMLAttributes } from "react";
import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import Image from "next/image";

type Props<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  inputClassName?: string;
};

/// This is react-hook-form compatible version of Input
export default function Search<T extends FieldValues>({
  name,
  label,
  register,
  errors,
  className = "mb-5",
  inputClassName = "",
  required,
  ...rest
}: Props<T>) {
  const error = _.get(errors, name) as FieldError | undefined;

  return (
    <fieldset className={`relative flex flex-col ${className}`}>
      {/*labelName && <Label name={labelName} required={required} />*/}
      <Image
        className="cursor-pointer mb-5 ml-auto mr-auto absolute top-[12px] left-[18px]"
        src="/search.svg"
        alt=""
        width="25"
        height="25"
      />
      <input
        id={name}
        className={`
          w-full rounded-[32px] focus:outline-none disabled:cursor-not-allowed
          bg-[#ffffff1f] border-[#212A36] border-[1px] text-[#9DA3AE] placeholder:text-[#9DA3AE]-500 pr-5 py-3 pl-[48px] ${inputClassName}
        `}
        type={rest.type}
        {...register(name, {
          valueAsNumber: rest.type === "number",
          required,
        })}
        {...rest}
      />
      {error?.message && (
        <p className="text-red-500 text-sm mx-5 absolute bottom-[-20px]">{error.message}</p>
      )}
    </fieldset>
  );
}
