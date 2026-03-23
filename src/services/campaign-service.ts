import prisma from '@/lib/prisma'

/**
 * Servicio de Campañas
 * Encapsula toda la lógica de negocio para las mesas de juego.
 */
export const CampaignService = {
  /**
   * Crea una nueva campaña validando permisos y relaciones.
   */
  async create(data: {
    name: string
    description?: string
    system: string
    imageUrl?: string
    gameMasterId: string
  }) {
    return await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        system: data.system,
        imageUrl: data.imageUrl,
        gameMasterId: data.gameMasterId,
      },
    })
  },

  /**
   * Obtiene todas las campañas de un Game Master.
   */
  async getAllByGM(gameMasterId: string) {
    return await prisma.campaign.findMany({
      where: { gameMasterId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { characters: true, activeMonsters: true },
        },
      },
    })
  },
}
