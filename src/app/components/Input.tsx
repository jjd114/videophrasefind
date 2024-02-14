import _ from "lodash";
import { type InputHTMLAttributes } from "react";
import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
// import Label from "@/app/components/Label";

type Props<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  inputClassName?: string;
};

/// This is react-hook-form compatible version of Input
export default function Input<T extends FieldValues>({
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
  // const labelName = label ?? String(name);

  return (
    <fieldset className={`relative flex flex-col ${className}`}>
      {/*labelName && <Label name={labelName} required={required} />*/}
      <input
        id={name}
        className={`
          placeholder:text-[#9DA3AE]-500 w-full rounded-[32px] border-[1px]
          border-[#212A36] bg-transparent px-5 py-3 text-[#9DA3AE] focus:outline-none disabled:cursor-not-allowed ${inputClassName}
        `}
        type={rest.type}
        {...register(name, {
          valueAsNumber: rest.type === "number",
          required,
        })}
        {...rest}
      />
      {error?.message && (
        <p className="absolute bottom-[-20px] mx-5 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </fieldset>
  );
}
