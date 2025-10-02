'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type QueryKey = [QueryKeys, ...ReadonlyArray<unknown>]

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: QueryKey
    defaultError: string
  }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: () => Infinity } } })

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

type QueryKeys = 'auth' | 'check-verification'
