'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryClientProvider(props: { children: ReactNode }) {
  return <TanstackQueryClientProvider client={client}>{props.children}</TanstackQueryClientProvider>;
}
