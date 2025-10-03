import React from "react";

interface FormInputProps {
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder: string;
  required: boolean;
  name: string;
  errors?: string[];
}

export default function FormInput({
  type,
  placeholder,
  required,
  name,
  errors = [],
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="h-10 w-full rounded-md border-none bg-transparent ring-1 ring-neutral-200 transition placeholder:text-neutral-300 focus:ring-3 focus:ring-orange-500 focus:outline-none"
        type={type}
        placeholder={placeholder}
        name={name}
        required={required}
      />
      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
