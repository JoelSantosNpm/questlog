import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/views/campaigns/api/campaign-queries', () => ({
  getCampaigns: vi.fn().mockResolvedValue([]),
  getCampaignById: vi.fn().mockResolvedValue(null),
}))

import { useCampaign, useCampaignList } from '@/views/campaigns/api/campaign-hooks'
import { getCampaignById, getCampaigns } from '@/views/campaigns/api/campaign-queries'
import { CAMPAIGN_KEYS } from '@/views/campaigns/api/query-keys'
import { useAuth } from '@clerk/nextjs'

const mockUseAuth = vi.mocked(useAuth)

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper: Wrapper, queryClient }
}

// ─── useCampaignList ──────────────────────────────────────────────────────────

describe('useCampaignList', () => {
  beforeEach(() => vi.clearAllMocks())

  it('normaliza null→undefined en la query key cuando Clerk devuelve null', async () => {
    mockUseAuth.mockReturnValue({ userId: null } as never)
    const { wrapper, queryClient } = makeWrapper()

    const { result } = renderHook(() => useCampaignList(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [entry] = queryClient.getQueryCache().findAll()
    expect(entry.queryKey).toEqual([...CAMPAIGN_KEYS.list(), 'all', undefined])
  })

  it('incluye el userId real en la query key cuando el usuario está autenticado', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc' } as never)
    const { wrapper, queryClient } = makeWrapper()

    const { result } = renderHook(() => useCampaignList(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [entry] = queryClient.getQueryCache().findAll()
    expect(entry.queryKey).toEqual([...CAMPAIGN_KEYS.list(), 'all', 'user_abc'])
  })

  it('llama a getCampaigns con undefined (no null) cuando no hay sesión', async () => {
    mockUseAuth.mockReturnValue({ userId: null } as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCampaignList(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getCampaigns).toHaveBeenCalledWith('all', undefined)
  })

  it('llama a getCampaigns con el userId cuando hay sesión', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc' } as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCampaignList(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getCampaigns).toHaveBeenCalledWith('all', 'user_abc')
  })

  it('respeta el filter personalizado pasado como argumento', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc' } as never)
    const { wrapper, queryClient } = makeWrapper()

    const { result } = renderHook(() => useCampaignList('public'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [entry] = queryClient.getQueryCache().findAll()
    expect(entry.queryKey).toEqual([...CAMPAIGN_KEYS.list(), 'public', 'user_abc'])
    expect(getCampaigns).toHaveBeenCalledWith('public', 'user_abc')
  })
})

// ─── useCampaign ─────────────────────────────────────────────────────────────

describe('useCampaign', () => {
  beforeEach(() => vi.clearAllMocks())

  it('normaliza null→undefined en la query key cuando Clerk devuelve null', async () => {
    mockUseAuth.mockReturnValue({ userId: null } as never)
    const { wrapper, queryClient } = makeWrapper()

    const { result } = renderHook(() => useCampaign('camp-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [entry] = queryClient.getQueryCache().findAll()
    expect(entry.queryKey).toEqual([...CAMPAIGN_KEYS.detail('camp-1'), undefined])
  })

  it('incluye el userId real en la query key cuando el usuario está autenticado', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc' } as never)
    const { wrapper, queryClient } = makeWrapper()

    const { result } = renderHook(() => useCampaign('camp-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [entry] = queryClient.getQueryCache().findAll()
    expect(entry.queryKey).toEqual([...CAMPAIGN_KEYS.detail('camp-1'), 'user_abc'])
  })

  it('llama a getCampaignById con undefined (no null) cuando no hay sesión', async () => {
    mockUseAuth.mockReturnValue({ userId: null } as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCampaign('camp-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getCampaignById).toHaveBeenCalledWith('camp-1', undefined)
  })

  it('llama a getCampaignById con el userId cuando hay sesión', async () => {
    mockUseAuth.mockReturnValue({ userId: 'user_abc' } as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCampaign('camp-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getCampaignById).toHaveBeenCalledWith('camp-1', 'user_abc')
  })
})
