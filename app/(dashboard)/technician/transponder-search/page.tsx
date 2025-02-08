'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransponders } from '@/app/services/transponderService';
import TransponderSearch from '@/app/components/TransponderSearch';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorFallback from '@/app/components/ErrorFallback';

export default function TransponderSearchPage() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the query when the error boundary resets
        window.location.reload();
      }}
    >
      <TransponderSearchContent />
    </ErrorBoundary>
  );
}

function TransponderSearchContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transponders'],
    queryFn: getTransponders,
    retry: 2
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  return <TransponderSearch data={data} />;
} 