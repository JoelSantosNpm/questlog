import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const {
  mockAdminFindMany,
  mockAdminFindFirst,
  mockTxFindMany,
  mockTxFindFirst,
  mockTxFindUniqueOrThrow,
  mockWithRLS,
} = vi.hoisted(() => ({
  mockAdminFindMany: vi.fn(),
  mockAdminFindFirst: vi.fn(),
  mockTxFindMany: vi.fn(),
  mockTxFindFirst: vi.fn(),
  mockTxFindUniqueOrThrow: vi.fn(),
  mockWithRLS: vi.fn(),
}))

vi.mock('@/shared/lib/prisma', () => ({
  prismaAdmin: {
    campaign: {
      findMany: mockAdminFindMany,
      findFirst: mockAdminFindFirst,
    },
  },
  withRLS: mockWithRLS,
}))

import { getCampaignById, getCampaigns } from '@/views/campaigns/api/campaign-queries'

// ─── getCampaigns ─────────────────────────────────────────────────────────────

describe('getCampaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAdminFindMany.mockResolvedValue([])
    mockTxFindMany.mockResolvedValue([])
    mockTxFindUniqueOrThrow.mockResolvedValue({ id: 'db-user-id' })
    mockWithRLS.mockImplementation((_userId: string, fn: (tx: unknown) => unknown) =>
      fn({
        campaign: { findMany: mockTxFindMany, findFirst: mockTxFindFirst },
        user: { findUniqueOrThrow: mockTxFindUniqueOrThrow },
      })
    )
  })

  it('sin clerkId usa prismaAdmin con isPublic:true', async () => {
    await getCampaigns()

    expect(mockAdminFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } })
    )
  })

  it('con clerkId y visibility=public usa prismaAdmin (no activa RLS)', async () => {
    await getCampaigns('public', 'both', 'user_123')

    expect(mockAdminFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } })
    )
  })

  it('con clerkId y visibility=all, ownership=owned construye OR con públicas y solo-propias', async () => {
    await getCampaigns('all', 'owned', 'user_123')

    expect(mockTxFindMany).toHaveBeenCalled()
    const { where } = mockTxFindMany.mock.calls[0][0] as { where: { OR: unknown[] } }
    expect(where.OR).toContainEqual({ isPublic: true })
    expect(where.OR).toContainEqual({ isPublic: false, gameMaster: { clerkId: 'user_123' } })
  })

  it('con clerkId y visibility=private, ownership=owned no incluye públicas', async () => {
    await getCampaigns('private', 'owned', 'user_123')

    expect(mockTxFindMany).toHaveBeenCalled()
    const { where } = mockTxFindMany.mock.calls[0][0] as Record<string, unknown>
    expect(where).toEqual({ isPublic: false, gameMaster: { clerkId: 'user_123' } })
  })

  it('devuelve [] si Prisma lanza un error', async () => {
    mockAdminFindMany.mockRejectedValueOnce(new Error('DB error'))

    const result = await getCampaigns()

    expect(result).toEqual([])
  })

  it('devuelve los datos que devuelve Prisma', async () => {
    const fakeRow = { id: 'c-1', name: 'Campaña Pública', isPublic: true }
    mockAdminFindMany.mockResolvedValueOnce([fakeRow])

    const result = await getCampaigns('public')

    expect(result).toEqual([fakeRow])
  })
})

// ─── getCampaignById ──────────────────────────────────────────────────────────

describe('getCampaignById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAdminFindFirst.mockResolvedValue(null)
    mockTxFindFirst.mockResolvedValue(null)
    mockWithRLS.mockImplementation((_userId: string, fn: (tx: unknown) => unknown) =>
      fn({
        campaign: { findMany: mockTxFindMany, findFirst: mockTxFindFirst },
        user: { findUniqueOrThrow: mockTxFindUniqueOrThrow },
      })
    )
  })

  it('sin clerkId usa prismaAdmin filtrando por id e isPublic:true', async () => {
    await getCampaignById('camp-1')

    expect(mockAdminFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'camp-1', isPublic: true } })
    )
  })

  it('con clerkId usa withRLS y solo filtra por id (RLS gestiona visibilidad)', async () => {
    await getCampaignById('camp-1', 'user_abc')

    expect(mockTxFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'camp-1' } })
    )
  })

  it('siempre filtra por el id correcto', async () => {
    await getCampaignById('camp-xyz')

    expect(mockAdminFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ id: 'camp-xyz' }) })
    )
  })

  it('devuelve null si Prisma lanza un error', async () => {
    mockAdminFindFirst.mockRejectedValueOnce(new Error('DB error'))

    const result = await getCampaignById('camp-1')

    expect(result).toBeNull()
  })

  it('devuelve la campaña si Prisma la encuentra', async () => {
    const fakeCampaign = { id: 'camp-1', name: 'Campaña', isPublic: true }
    mockAdminFindFirst.mockResolvedValueOnce(fakeCampaign)

    const result = await getCampaignById('camp-1')

    expect(result).toEqual(fakeCampaign)
  })
})
