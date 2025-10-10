import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...inputProps
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-300 focus:ring-3 focus:ring-orange-500 focus:outline-none"
        name={name}
        autoComplete="off"
        {...inputProps}
      />
      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
