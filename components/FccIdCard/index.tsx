import React from "react";
import { cn } from "@/lib/utils";

interface FccIdCardProps {
  data?: {
    id: string;
    status: string;
    manufacturer: string;
    model: string;
    frequency: string;
    lastUpdated: string;
  };
  loading?: boolean;
  error?: string;
  darkMode?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function FccIdCard({
  data,
  loading,
  error,
  darkMode,
  onSelect,
  className,
}: FccIdCardProps) {
  if (loading) {
    return (
      <div
        data-testid="loading-skeleton"
        className={cn(
          "animate-pulse bg-gray-200 rounded-lg p-4",
          darkMode && "dark:bg-gray-700",
          className
        )}
      />
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "bg-red-50 p-4 rounded-lg",
          darkMode && "dark:bg-red-900 dark:text-red-100",
          className
        )}
      >
        <span className="text-red-500">Error</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      data-testid="fcc-id-card"
      className={cn(
        "bg-white p-4 rounded-lg shadow-sm border",
        darkMode && "dark:bg-gray-800 dark:text-white dark:border-gray-700",
        className
      )}
      onClick={() => onSelect?.(data.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{data.id}</h3>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-sm",
            data.status === "valid" && "bg-green-100 text-green-800",
            data.status === "invalid" && "bg-red-100 text-red-800",
            data.status === "pending" && "bg-yellow-100 text-yellow-800"
          )}
        >
          {data.status}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manufacturer: {data.manufacturer}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Model: {data.model}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Frequency: {data.frequency}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
