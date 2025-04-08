import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100",
          sizeClasses[size]
        )}
      ></div>
    </div>
  );
}
