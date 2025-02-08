'use client';

import { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import TransponderSearch from '@/app/components/TransponderSearch';
import { useTransponderData } from '@/app/hooks/useTransponderData';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
      <div className="flex items-center">
        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
        {error.message}
      </div>
    </div>
  );
}

function TransponderSearchWithData() {
  const { data, isLoading, error } = useTransponderData();

  console.log('TransponderSearchWithData:', { data, isLoading, error });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!data) {
    console.log('No data available');
    return <ErrorState error={new Error('No transponder data available')} />;
  }

  return <TransponderSearch data={data} />;
}

export default function TransponderSearchClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Transponder Search
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <Suspense fallback={<LoadingState />}>
              <TransponderSearchWithData />
            </Suspense>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
} 