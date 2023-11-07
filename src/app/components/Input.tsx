import _ from 'lodash';
import { type InputHTMLAttributes } from 'react';
import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from 'react-hook-form';
import Label from './Label';

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
  className = 'mb-4',
  inputClassName = '',
  required,
  ...rest
}: Props<T>) {
  const error = _.get(errors, name) as FieldError | undefined;
  const labelName = label ?? String(name);

  return (
    <fieldset className={`flex flex-col ${className}`}>
      {labelName && <Label name={labelName} required={required} />}
      <input
        id={name}
        className={`
          w-full rounded-lg focus:ring-2 focus:ring-secondary disabled:cursor-not-allowed
          bg-[#F9FBFD] border-[#005F730D] border-[1px] text-gray-500 disabled:text-gray-400 placeholder:text-gray-400 p-5 ${inputClassName}
        `}
        type={rest.type}
        {...register(name, {
          valueAsNumber: rest.type === 'number',
          required,
        })}
        {...rest}
      />
      {error?.message && (
        <p className="text-red-500 text-sm mx-1">{error.message}</p>
      )}
    </fieldset>
  );
}