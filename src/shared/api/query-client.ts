import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// queryClient de servidor
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    })
)
