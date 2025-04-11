import React from "react";
import { cn } from "@/lib/utils";
import { XCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning";
  icon?: boolean;
  title?: string;
  darkMode?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    darkBg: "dark:bg-blue-900",
    darkText: "dark:text-blue-200",
    icon: Info,
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-800",
    darkBg: "dark:bg-green-900",
    darkText: "dark:text-green-200",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-800",
    darkBg: "dark:bg-red-900",
    darkText: "dark:text-red-200",
    icon: XCircle,
  },
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    darkBg: "dark:bg-yellow-900",
    darkText: "dark:text-yellow-200",
    icon: AlertCircle,
  },
};

export function Alert({
  children,
  variant = "default",
  icon,
  title,
  darkMode,
  onDismiss,
  className,
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      className={cn(
        "relative rounded-lg p-4",
        styles.bg,
        styles.text,
        darkMode && [styles.darkBg, styles.darkText],
        className
      )}
    >
      {icon && (
        <Icon
          data-testid="alert-icon"
          className="absolute left-4 top-4 h-5 w-5"
        />
      )}
      <div className={cn("flex justify-between", icon && "pl-8")}>
        <div>
          {title && <h5 className="font-medium">{title}</h5>}
          <div className={cn(title && "mt-1")}>{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-gray-500 hover:text-gray-700"
            aria-label="dismiss"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
