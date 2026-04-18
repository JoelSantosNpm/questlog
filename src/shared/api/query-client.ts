import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// cache() is used to memoize the QueryClient across a single request
export const getQueryClient = cache(() => new QueryClient())
