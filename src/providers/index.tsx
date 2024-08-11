'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
        </QueryClientProvider>
    );
}
