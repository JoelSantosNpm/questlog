import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/views/campaigns/api/campaign-actions', () => ({
  createCampaign: vi.fn(),
  updateCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
}))

import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from '@/views/campaigns/api/campaign-actions'
import {
  useCreateCampaign,
  useDeleteCampaign,
  useUpdateCampaign,
} from '@/views/campaigns/api/campaign-mutations'
import { CAMPAIGN_KEYS } from '@/views/campaigns/api/query-keys'

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return { wrapper: Wrapper, queryClient, invalidateSpy }
}

const okResponse = { success: true, message: 'OK' }

// ─── useCreateCampaign ────────────────────────────────────────────────────────

describe('useCreateCampaign', () => {
  beforeEach(() => vi.clearAllMocks())

  it('llama a createCampaign con los datos proporcionados', async () => {
    vi.mocked(createCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useCreateCampaign(), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'Leyenda Dorada' }))

    expect(createCampaign).toHaveBeenCalledWith({ name: 'Leyenda Dorada' }, expect.anything())
  })

  it('invalida CAMPAIGN_KEYS.list() tras el éxito', async () => {
    vi.mocked(createCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useCreateCampaign(), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'Leyenda Dorada' }))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: CAMPAIGN_KEYS.list() })
  })

  it('no invalida el caché si la mutación falla', async () => {
    vi.mocked(createCampaign).mockRejectedValueOnce(new Error('Server error'))
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useCreateCampaign(), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'Leyenda Dorada' }).catch(() => {}))

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})

// ─── useUpdateCampaign ────────────────────────────────────────────────────────

describe('useUpdateCampaign', () => {
  beforeEach(() => vi.clearAllMocks())

  it('llama a updateCampaign con los datos proporcionados', async () => {
    vi.mocked(updateCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useUpdateCampaign(), { wrapper })
    await act(() => result.current.mutateAsync({ id: 'camp-1', name: 'Actualizada' }))

    expect(updateCampaign).toHaveBeenCalledWith(
      { id: 'camp-1', name: 'Actualizada' },
      expect.anything()
    )
  })

  it('invalida CAMPAIGN_KEYS.list() tras el éxito', async () => {
    vi.mocked(updateCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useUpdateCampaign(), { wrapper })
    await act(() => result.current.mutateAsync({ id: 'camp-1', name: 'Actualizada' }))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: CAMPAIGN_KEYS.list() })
  })
})

// ─── useDeleteCampaign ────────────────────────────────────────────────────────

describe('useDeleteCampaign', () => {
  beforeEach(() => vi.clearAllMocks())

  it('llama a deleteCampaign con el id correcto', async () => {
    vi.mocked(deleteCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper } = makeWrapper()

    const { result } = renderHook(() => useDeleteCampaign(), { wrapper })
    await act(() => result.current.mutateAsync('camp-1'))

    expect(deleteCampaign).toHaveBeenCalledWith('camp-1', expect.anything())
  })

  it('invalida CAMPAIGN_KEYS.list() tras el éxito', async () => {
    vi.mocked(deleteCampaign).mockResolvedValueOnce(okResponse as never)
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useDeleteCampaign(), { wrapper })
    await act(() => result.current.mutateAsync('camp-1'))

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: CAMPAIGN_KEYS.list() })
  })

  it('no invalida el caché si la mutación falla', async () => {
    vi.mocked(deleteCampaign).mockRejectedValueOnce(new Error('Server error'))
    const { wrapper, invalidateSpy } = makeWrapper()

    const { result } = renderHook(() => useDeleteCampaign(), { wrapper })
    await act(() => result.current.mutateAsync('camp-1').catch(() => {}))

    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})

// ─── Integración: query keys ──────────────────────────────────────────────────

describe('CAMPAIGN_KEYS en mutaciones', () => {
  it('todas las mutaciones invalidan la misma key base de lista', async () => {
    const expected = CAMPAIGN_KEYS.list()

    vi.mocked(createCampaign).mockResolvedValueOnce(okResponse as never)
    vi.mocked(updateCampaign).mockResolvedValueOnce(okResponse as never)
    vi.mocked(deleteCampaign).mockResolvedValueOnce(okResponse as never)

    const { wrapper, invalidateSpy } = makeWrapper()

    const { result: createResult } = renderHook(() => useCreateCampaign(), { wrapper })
    const { result: updateResult } = renderHook(() => useUpdateCampaign(), { wrapper })
    const { result: deleteResult } = renderHook(() => useDeleteCampaign(), { wrapper })

    await act(async () => {
      await createResult.current.mutateAsync({ name: 'A' })
      await updateResult.current.mutateAsync({ id: 'x', name: 'B' })
      await deleteResult.current.mutateAsync('x')
    })

    await waitFor(() => {
      const calls = invalidateSpy.mock.calls.map((c) => c[0])
      expect(calls).toHaveLength(3)
      calls.forEach((call) => {
        expect((call as { queryKey: unknown }).queryKey).toEqual(expected)
      })
    })
  })
})
