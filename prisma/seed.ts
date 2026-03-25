/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Rarity, ResourceType, AccessType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const gmEmail = process.env.SEED_GM_EMAIL
  const playerEmail = process.env.SEED_PLAYER_EMAIL

  if (!gmEmail || !playerEmail) {
    console.error('SEED_GM_EMAIL y SEED_PLAYER_EMAIL deben estar definidos en .env')
    process.exit(1)
  }

  // Obtener o crear usuarios
  let gm = await prisma.user.findUnique({ where: { email: gmEmail } })
  let player = await prisma.user.findUnique({ where: { email: playerEmail } })

  if (!gm) {
    console.log(`--- Creando Usuario GM (${gmEmail}) ---`)
    gm = await prisma.user.create({
      data: {
        email: gmEmail,
        clerkId: 'user_e2e_gm_mock', // Mock ID, Clerk lo sincronizará al entrar
        name: 'Dungeon Master de Prueba',
      },
    })
  }

  if (!player) {
    console.log(`--- Creando Usuario Player (${playerEmail}) ---`)
    player = await prisma.user.create({
      data: {
        email: playerEmail,
        clerkId: 'user_e2e_player_mock',
        name: 'Jugador de Prueba',
      },
    })
  }

  console.log('--- Limpiando Base de Datos ---')
  // El migrate dev --reset ya limpia, pero por seguridad si se corre manual:
  await prisma.accessGrant.deleteMany()
  await prisma.item.deleteMany()
  await prisma.itemTemplate.deleteMany()
  await prisma.activeMonster.deleteMany()
  await prisma.monsterTemplate.deleteMany()
  await prisma.character.deleteMany()
  await prisma.characterTemplate.deleteMany()
  await prisma.sessionNote.deleteMany()
  await prisma.quest.deleteMany()
  await prisma.campaign.deleteMany()

  console.log('--- Creando Campaña ---')
  const campaign = await prisma.campaign.create({
    data: {
      name: 'La Maldición de Strahd',
      description: 'Una campaña gótica en las tierras de Barovia.',
      gameMasterId: gm.id,
      location: 'Barovia',
    },
  })

  console.log('--- Creando Plantillas de Ítems ---')
  const swordTemplate = await prisma.itemTemplate.create({
    data: {
      name: 'Espada Larga de Plata',
      description: 'Efectiva contra licántropos.',
      rarity: Rarity.UNCOMMON,
      category: 'Weapon',
      value: 500,
      weight: 3.0,
      strength: 0,
      ac: 0,
      creatorId: gm.id,
    },
  })

  const armorTemplate = await prisma.itemTemplate.create({
    data: {
      name: 'Armadura de Placas +1',
      description: 'Una armadura reluciente que ofrece gran protección.',
      rarity: Rarity.RARE,
      category: 'Armor',
      value: 5000,
      weight: 65.0,
      ac: 19,
      creatorId: gm.id,
    },
  })

  console.log('--- Creando Personaje ---')
  const character = await prisma.character.create({
    data: {
      name: 'Valerius el Valiente',
      userId: player.id,
      campaignId: campaign.id,
      level: 5,
      maxHp: 45,
      currentHp: 42,
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 14,
      ac: 18,
      speed: 30,
    },
  })

  console.log('--- Entregando Ítem al Personaje ---')
  await prisma.item.create({
    data: {
      name: 'Espada de Valerius',
      templateId: swordTemplate.id,
      characterId: character.id,
      campaignId: campaign.id,
      isEquipped: true,
      rarity: Rarity.UNCOMMON,
    },
  })

  console.log('--- Creando Monstruos (Bestiario) ---')
  const wolfTemplate = await prisma.monsterTemplate.create({
    data: {
      name: 'Lobo de Barovia',
      type: 'Bestia',
      challenge: 0.5,
      maxHp: 11,
      strength: 12,
      dexterity: 15,
      constitution: 12,
      intelligence: 3,
      wisdom: 12,
      charisma: 6,
      ac: 13,
      speed: 40,
      perception: 13,
      authorId: gm.id,
    },
  })

  console.log('--- Spawneando Monstruos en la Campaña ---')
  await prisma.activeMonster.create({
    data: {
      name: 'Lobo Alfa',
      templateId: wolfTemplate.id,
      campaignId: campaign.id,
      maxHp: 22,
      currentHp: 22,
      strength: 14,
      ac: 14,
    },
  })

  console.log('--- Creando Permisos de Acceso ---')
  await prisma.accessGrant.create({
    data: {
      granteeId: player.id,
      resourceType: ResourceType.CAMPAIGN,
      resourceId: campaign.id,
      access: AccessType.VIEW,
    },
  })

  console.log('--- Semilla completada con éxito ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
