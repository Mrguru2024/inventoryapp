import { useQuery } from '@tanstack/react-query';
import { getTransponderData, TransponderKeyData } from '@/app/services/transponderService';

export function useTransponderData() {
  return useQuery<TransponderKeyData[], Error>({
    queryKey: ['transponderData'],
    queryFn: getTransponderData,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
} 