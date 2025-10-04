'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - increased for better performance
            gcTime: 15 * 60 * 1000, // 15 minutes - increased for better caching
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors
              const errorObj = error as { status?: number };
              if (errorObj?.status && errorObj.status >= 400 && errorObj.status < 500) {
                return false;
              }
              return failureCount < 2; // Reduced retries for faster failure handling
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Prevent unnecessary refetches
            refetchOnReconnect: 'always',
            networkMode: 'online', // Only run queries when online
            // Enable background refetching for better UX
            refetchInterval: false,
            refetchIntervalInBackground: false,
            // Optimize for performance
            notifyOnChangeProps: ['data', 'error'],
            structuralSharing: true,
          },
          mutations: {
            retry: 1,
            networkMode: 'online',
            // Optimize mutation performance
            onError: (error) => {
              console.error('Mutation error:', error);
            },
          },
        },
        // Enable query deduplication
        queryCache: new QueryCache({
          onError: (error) => {
            console.error('Query error:', error);
          },
        }),
        // Enable mutation deduplication
        mutationCache: new MutationCache({
          onError: (error) => {
            console.error('Mutation error:', error);
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 