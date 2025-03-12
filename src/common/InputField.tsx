import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: { message?: string };
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <div className="mt-2">
          <input
            id={id}
            ref={ref}
            {...props}
            className={`block w-full rounded-md bg-white border px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm ${
              error
                ? "border-red-500 focus:outline-2 focus:outline-red-500"
                : "border-gray-300 focus:outline-2 focus:outline-[#2596be]"
            }`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
