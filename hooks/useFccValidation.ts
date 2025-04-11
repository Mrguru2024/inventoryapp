import { useState } from "react";

export const useFccValidation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validateFccId = async (fccId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { isValid: true, message: "FCC ID is valid" };
    } catch (error) {
      return { isValid: false, message: "Invalid FCC ID" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateFccId,
    isLoading,
  };
};
