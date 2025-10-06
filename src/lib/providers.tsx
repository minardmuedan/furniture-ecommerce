'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type QueryKey = [QueryKeys, ...ReadonlyArray<unknown>]

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKey
    defaultError: string
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: () => Infinity } },
})

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

type QueryKeys = 'session' | 'check-verification'
