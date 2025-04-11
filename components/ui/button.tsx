import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  darkMode?: boolean;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: {
    base: "bg-blue-600 text-white hover:bg-blue-700",
    dark: "dark:bg-blue-500 dark:hover:bg-blue-600",
  },
  secondary: {
    base: "bg-gray-600 text-white hover:bg-gray-700",
    dark: "dark:bg-gray-500 dark:hover:bg-gray-600",
  },
  outline: {
    base: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    dark: "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
  },
  ghost: {
    base: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    dark: "dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white",
  },
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  darkMode = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        styles.base,
        darkMode && styles.dark,
        sizeStyles[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          data-testid="loading-spinner"
          className="mr-2 h-4 w-4 animate-spin"
        />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
