import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    campaign: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

import { prisma } from '@/shared/lib/prisma'
import { getCampaignById, getCampaigns } from '@/views/campaigns/api/campaign-queries'

const mockCampaign = vi.mocked(prisma.campaign)

// ─── getCampaigns ─────────────────────────────────────────────────────────────

describe('getCampaigns', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sin clerkId solo incluye la condición isPublic:true en el OR', async () => {
    mockCampaign.findMany.mockResolvedValueOnce([])

    await getCampaigns('all')

    const { where } = mockCampaign.findMany.mock.calls[0][0] as { where: { OR: unknown[] } }
    expect(where.OR).toContainEqual({ isPublic: true })
    // No debe añadir condición de gameMaster
    const hasGameMaster = where.OR.some(
      (c) => typeof c === 'object' && c !== null && 'gameMaster' in c
    )
    expect(hasGameMaster).toBe(false)
  })

  it('con clerkId y filter=all añade la condición del dueño al OR', async () => {
    mockCampaign.findMany.mockResolvedValueOnce([])

    await getCampaigns('all', 'user_123')

    const { where } = mockCampaign.findMany.mock.calls[0][0] as { where: { OR: unknown[] } }
    expect(where.OR).toContainEqual({ isPublic: true })
    expect(where.OR).toContainEqual({ gameMaster: { clerkId: 'user_123' } })
  })

  it('con filter=public nunca añade condición del dueño aunque haya clerkId', async () => {
    mockCampaign.findMany.mockResolvedValueOnce([])

    await getCampaigns('public', 'user_123')

    const { where } = mockCampaign.findMany.mock.calls[0][0] as { where: { OR: unknown[] } }
    expect(where.OR).toContainEqual({ isPublic: true })
    const hasGameMaster = where.OR.some(
      (c) => typeof c === 'object' && c !== null && 'gameMaster' in c
    )
    expect(hasGameMaster).toBe(false)
  })

  it('con filter=owned el OR solo contiene la condición del dueño', async () => {
    mockCampaign.findMany.mockResolvedValueOnce([])

    await getCampaigns('owned', 'user_123')

    const { where } = mockCampaign.findMany.mock.calls[0][0] as { where: { OR: unknown[] } }
    expect(where.OR).toEqual([{ gameMaster: { clerkId: 'user_123' } }])
  })

  it('devuelve [] si Prisma lanza un error', async () => {
    mockCampaign.findMany.mockRejectedValueOnce(new Error('DB error'))

    const result = await getCampaigns()

    expect(result).toEqual([])
  })

  it('devuelve los datos que devuelve Prisma', async () => {
    const fakeRow = { id: 'c-1', name: 'Campaña Pública', isPublic: true }
    mockCampaign.findMany.mockResolvedValueOnce([fakeRow] as never)

    const result = await getCampaigns('public')

    expect(result).toEqual([fakeRow])
  })
})

// ─── getCampaignById ──────────────────────────────────────────────────────────

describe('getCampaignById', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sin clerkId el OR solo incluye isPublic:true (seguridad: no expone privadas)', async () => {
    mockCampaign.findFirst.mockResolvedValueOnce(null)

    await getCampaignById('camp-1')

    const { where } = mockCampaign.findFirst.mock.calls[0][0] as {
      where: { id: string; OR: unknown[] }
    }
    expect(where.OR).toEqual([{ isPublic: true }])
  })

  it('con clerkId válido añade la condición del dueño al OR', async () => {
    mockCampaign.findFirst.mockResolvedValueOnce(null)

    await getCampaignById('camp-1', 'user_abc')

    const { where } = mockCampaign.findFirst.mock.calls[0][0] as {
      where: { id: string; OR: unknown[] }
    }
    expect(where.OR).toContainEqual({ isPublic: true })
    expect(where.OR).toContainEqual({ gameMaster: { clerkId: 'user_abc' } })
  })

  it('siempre filtra por el id correcto', async () => {
    mockCampaign.findFirst.mockResolvedValueOnce(null)

    await getCampaignById('camp-xyz', 'user_abc')

    const { where } = mockCampaign.findFirst.mock.calls[0][0] as {
      where: { id: string; OR: unknown[] }
    }
    expect(where.id).toBe('camp-xyz')
  })

  it('devuelve null si Prisma lanza un error', async () => {
    mockCampaign.findFirst.mockRejectedValueOnce(new Error('DB error'))

    const result = await getCampaignById('camp-1')

    expect(result).toBeNull()
  })

  it('devuelve la campaña si Prisma la encuentra', async () => {
    const fakeCampaign = { id: 'camp-1', name: 'Campaña', isPublic: true }
    mockCampaign.findFirst.mockResolvedValueOnce(fakeCampaign as never)

    const result = await getCampaignById('camp-1')

    expect(result).toEqual(fakeCampaign)
  })
})
