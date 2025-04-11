import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  darkMode?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", darkMode = false, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          darkMode
            ? "dark:border-gray-700 dark:text-gray-50 dark:focus:ring-blue-400"
            : ""
        } ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
