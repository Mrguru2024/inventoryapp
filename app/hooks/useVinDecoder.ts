import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NHTSAVehicleInfo } from "@/app/services/nhtsaService";

interface UseVinDecoderProps {
  vin: string;
  modelYear?: number;
  enabled?: boolean;
}

export function useVinDecoder({
  vin,
  modelYear,
  enabled = true,
}: UseVinDecoderProps) {
  const [error, setError] = useState<string | null>(null);

  const { data: vehicleInfo, isLoading } = useQuery<NHTSAVehicleInfo | null>({
    queryKey: ["vin", vin, modelYear],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          vin,
          ...(modelYear && { year: modelYear.toString() }),
        });

        const response = await fetch(`/api/vin?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to decode VIN");
        }

        return response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      }
    },
    enabled: enabled && !!vin,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  return {
    vehicleInfo,
    isLoading,
    error,
  };
}
