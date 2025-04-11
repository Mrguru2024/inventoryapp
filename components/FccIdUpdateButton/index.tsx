"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface FccIdUpdateButtonProps {
  fccId: string;
  darkMode?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FccIdUpdateButton = ({
  fccId,
  darkMode = false,
  disabled = false,
  className = "",
}: FccIdUpdateButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await router.push(`/fcc-id-management/${fccId}`);
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClasses = `
    px-4 py-2 
    ${
      darkMode
        ? "bg-blue-500 hover:bg-blue-600"
        : "bg-blue-600 hover:bg-blue-700"
    } 
    text-white rounded 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={buttonClasses}
      aria-label="Update FCC ID"
    >
      {isLoading ? "Loading..." : "Update FCC ID"}
    </button>
  );
};
