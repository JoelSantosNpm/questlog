import prisma from '../src/lib/prisma'

async function main() {
  // Obtener usuarios por email
  const gm = await prisma.user.findUnique({ where: { email: process.env.SEED_GM_EMAIL } })
  const player = await prisma.user.findUnique({ where: { email: process.env.SEED_PLAYER_EMAIL } })

  if (!gm || !player) {
    console.error(
      'No se encontró el usuario GM o Player. Verifica que los correos existen en la base de datos.'
    )
    process.exit(1)
  }

  // Crear campaña asociada al GM
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Campaña Test Cascada',
      description: 'Prueba de borrado en cascada',
      gameMasterId: gm.id,
    },
  })

  // Crear personaje asociado al player y a la campaña
  const character = await prisma.character.create({
    data: {
      name: 'Personaje Test',
      campaignId: campaign.id,
      userId: player.id,
      maxHp: 20,
      currentHp: 18,
      stats: {
        str: 10,
        dex: 12,
        con: 14,
        int: 8,
        wis: 10,
        cha: 12,
      },
    },
  })

  // Crear item para el personaje
  const item = await prisma.item.create({
    data: {
      name: 'Espada Cascada',
      characterId: character.id,
      rarity: 'Rare',
      quantity: 1,
      type: 'Weapon', // Ajusta el valor según tu modelo de Item
    },
  })

  // Crear monstruo
  const monster = await prisma.monster.create({
    data: {
      name: 'Goblin Cascada',
      maxHp: 20,
      ac: 15,
      stats: {
        str: 8,
        dex: 14,
      },
      challenge: 0.25,
      type: 'Goblin',
    },
  })

  // Crear monstruo en la campaña
  const activeMonster = await prisma.activeMonster.create({
    data: {
      name: 'Goblin Cascada',
      currentHp: 20,
      campaignId: campaign.id,
      monsterId: monster.id,
    },
  })

  // Crear nota de sesión en la campaña
  const sessionNote = await prisma.sessionNote.create({
    data: {
      content: 'Probando borrado en cascada.',
      campaignId: campaign.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
