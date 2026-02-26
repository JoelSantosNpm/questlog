import prisma from '../src/lib/prisma.js'

async function main() {
  const testEmail = process.env.SEED_USER_EMAIL

  if (!testEmail) {
    console.error(
      '❌ Error: Por favor, define SEED_USER_EMAIL en tu archivo .env con el email de tu cuenta de pruebas.'
    )
    process.exit(1)
  }

  console.log(`🌱 Buscando usuario con email: ${testEmail}...\n`)

  // 1. Buscar el usuario por email (creado previamente al hacer login en la UI)
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
  })

  if (!user) {
    console.error(`❌ Error: No se encontró ningún usuario con el email ${testEmail}.`)
    console.error(
      '👉 Por favor, inicia sesión en la aplicación web (localhost:3000) primero para que el usuario se sincronice en la base de datos, y luego vuelve a ejecutar este script.'
    )
    process.exit(1)
  }

  console.log(`✅ Usuario encontrado: ${user.name || user.email} (Clerk ID: ${user.clerkId})`)

  // 2. Limpiar campañas anteriores de este usuario (para que sea idempotente)
  console.log('🧹 Limpiando datos de prueba anteriores...')
  await prisma.campaign.deleteMany({
    where: { userId: user.id },
  })

  // 3. Crear campañas de prueba
  console.log('⚔️ Creando campañas y personajes de prueba...')
  const campaignsData = [
    {
      name: 'La Mina Perdida de Phandelver',
      description: 'Una aventura clásica para empezar.',
      imageUrl:
        'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'La Maldición de Strahd',
      description: 'Terror gótico en las tierras de Barovia.',
      imageUrl:
        'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'El Descenso a Avernus',
      description: 'Un viaje a los Nueve Infiernos.',
      imageUrl:
        'https://images.unsplash.com/photo-1501466044931-62695aada8e9?q=80&w=800&auto=format&fit=crop',
    },
  ]

  for (const camp of campaignsData) {
    const campaign = await prisma.campaign.create({
      data: {
        ...camp,
        userId: user.id,
      },
    })
    console.log(`✅ Campaña creada: ${campaign.name}`)

    // 4. Crear un personaje de prueba para cada campaña
    await prisma.character.create({
      data: {
        name: `Héroe de ${campaign.name.split(' ')[1] || 'Prueba'}`,
        userId: user.id,
        campaignId: campaign.id,
      },
    })
  }

  console.log('\n🎉 ¡Seed completado con éxito! Datos de prueba listos para usar.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
