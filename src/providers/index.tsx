'use client';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/lib/store/store';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={0}>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
            <Toaster />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
