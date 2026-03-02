import prisma from '@/lib/prisma'

async function main() {
  console.log('🚀 Iniciando pruebas de integridad y borrado en cascada...')

  // ---------------------------------------------------------
  // 1. SETUP: Crear Datos de Prueba
  // ---------------------------------------------------------
  console.log('\n📦 Creando datos iniciales...')

  const gm = await prisma.user.create({
    data: {
      clerkId: `test-gm-${Date.now()}`,
      email: `gm-${Date.now()}@test.com`,
      name: 'GM de Prueba',
    },
  })

  const player = await prisma.user.create({
    data: {
      clerkId: `test-player-${Date.now()}`,
      email: `player-${Date.now()}@test.com`,
      name: 'Jugador de Prueba',
    },
  })

  const campaign = await prisma.campaign.create({
    data: {
      name: 'Campaña Condenada',
      description: 'Esta campaña será borrada para probar la cascada.',
      gameMasterId: gm.id,
    },
  })

  // Personaje vinculado a Campaña
  const character = await prisma.character.create({
    data: {
      name: 'Heroe Vinculado',
      userId: player.id,
      campaignId: campaign.id,
      currentHp: 10,
      maxHp: 20,
      stats: { str: 10, dex: 12 },
    },
  })

  // Item del personaje
  const item = await prisma.item.create({
    data: {
      name: 'Espada de Madera',
      characterId: character.id,
      rarity: 'Common',
      type: 'Weapon',
    },
  })

  // Nota de sesión
  const note = await prisma.sessionNote.create({
    data: {
      content: 'El grupo entró en la mazmorra...',
      campaignId: campaign.id,
    },
  })

  // Monstruo Activo (requiere un Monster base primero)
  const baseMonster = await prisma.monster.create({
    data: {
      name: 'Goblin Base',
      maxHp: 7,
      ac: 15,
      stats: { str: 8, dex: 14 },
      challenge: 0.25,
      type: 'Humanoid',
    },
  })

  const activeMonster = await prisma.activeMonster.create({
    data: {
      campaignId: campaign.id,
      currentHp: 7,
      monsterId: baseMonster.id,
    },
  })

  console.log('✅ Datos creados exitosamente.')

  // ---------------------------------------------------------
  // 2. PRUEBA: Borrar Campaña
  // ---------------------------------------------------------
  console.log('\n🔥 Borrando Campaña...')
  await prisma.campaign.delete({ where: { id: campaign.id } })
  console.log('✅ Campaña borrada.')

  // ---------------------------------------------------------
  // 3. VERIFICACIÓN: ¿Qué sobrevivió?
  // ---------------------------------------------------------
  console.log('\n🔍 Verificando resultados...')

  const checkCharacter = await prisma.character.findUnique({ where: { id: character.id } })
  const checkNote = await prisma.sessionNote.findUnique({ where: { id: note.id } })
  const checkActiveMonster = await prisma.activeMonster.findUnique({
    where: { id: activeMonster.id },
  })
  const checkItem = await prisma.item.findUnique({ where: { id: item.id } }) // Debería seguir existiendo porque el personaje sobrevive

  console.log(`- Personaje (SetNull expected): ${checkCharacter ? 'SOBREVIVIÓ ✅' : 'BORRADO ❌'}`)
  if (checkCharacter) {
    console.log(`  > CampaignId es: ${checkCharacter.campaignId} (Esperado: null)`)
  }

  console.log(`- Nota de Sesión (Cascade expected): ${checkNote ? 'SOBREVIVIÓ ❌' : 'BORRADO ✅'}`)
  console.log(
    `- Monstruo Activo (Cascade expected): ${checkActiveMonster ? 'SOBREVIVIÓ ❌' : 'BORRADO ✅'}`
  )
  console.log(`- Item del Personaje (Debe existir): ${checkItem ? 'EXISTE ✅' : 'DESAPARECIÓ ❌'}`)

  // ---------------------------------------------------------
  // 4. PRUEBA: Borrar Jugador (User)
  // ---------------------------------------------------------
  console.log('\n🔥 Borrando Jugador (User)...')
  await prisma.user.delete({ where: { id: player.id } })

  const checkCharacterAfterUserDelete = await prisma.character.findUnique({
    where: { id: character.id },
  })
  const checkItemAfterUserDelete = await prisma.item.findUnique({ where: { id: item.id } })

  console.log(
    `- Personaje tras borrar User (Cascade expected): ${checkCharacterAfterUserDelete ? 'SOBREVIVIÓ ❌' : 'BORRADO ✅'}`
  )
  console.log(
    `- Item tras borrar Personaje (Cascade expected): ${checkItemAfterUserDelete ? 'SOBREVIVIÓ ❌' : 'BORRADO ✅'}`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
