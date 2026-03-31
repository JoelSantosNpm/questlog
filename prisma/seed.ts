import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function id() {
  return crypto.randomUUID()
}

async function main() {
  const gmEmail = process.env.SEED_GM_EMAIL
  const playerEmail = process.env.SEED_PLAYER_EMAIL

  if (!gmEmail || !playerEmail) {
    console.error('SEED_GM_EMAIL y SEED_PLAYER_EMAIL deben estar definidos en .env')
    process.exit(1)
  }

  // Obtener o crear usuarios
  let { data: gm } = await supabase.from('User').select('id').eq('email', gmEmail).single()
  let { data: player } = await supabase.from('User').select('id').eq('email', playerEmail).single()

  if (!gm) {
    console.log(`--- Creando Usuario GM (${gmEmail}) ---`)
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: id(),
        email: gmEmail,
        clerkId: 'user_e2e_gm_mock',
        name: 'Dungeon Master de Prueba',
        updatedAt: new Date().toISOString(),
      })
      .select('id')
      .single()
    if (error) throw error
    gm = data
  }

  if (!player) {
    console.log(`--- Creando Usuario Player (${playerEmail}) ---`)
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: id(),
        email: playerEmail,
        clerkId: 'user_e2e_player_mock',
        name: 'Jugador de Prueba',
        updatedAt: new Date().toISOString(),
      })
      .select('id')
      .single()
    if (error) throw error
    player = data
  }

  console.log('--- Limpiando Base de Datos ---')
  await supabase.from('AccessGrant').delete().neq('id', '')
  await supabase.from('Item').delete().neq('id', '')
  await supabase.from('ItemTemplate').delete().neq('id', '')
  await supabase.from('ActiveMonster').delete().neq('id', '')
  await supabase.from('MonsterTemplate').delete().neq('id', '')
  await supabase.from('Character').delete().neq('id', '')
  await supabase.from('CharacterTemplate').delete().neq('id', '')
  await supabase.from('SessionNote').delete().neq('id', '')
  await supabase.from('Quest').delete().neq('id', '')
  await supabase.from('Campaign').delete().neq('id', '')

  console.log('--- Creando Campaña ---')
  const { data: campaign, error: campaignError } = await supabase
    .from('Campaign')
    .insert({
      id: id(),
      name: 'La Maldición de Strahd',
      description: 'Una campaña gótica en las tierras de Barovia.',
      gameMasterId: gm.id,
      location: 'Barovia',
      updatedAt: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (campaignError) throw campaignError

  console.log('--- Creando Plantillas de Ítems ---')
  const { data: swordTemplate, error: swordError } = await supabase
    .from('ItemTemplate')
    .insert({
      id: id(),
      name: 'Espada Larga de Plata',
      description: 'Efectiva contra licántropos.',
      rarity: 'UNCOMMON',
      category: 'Weapon',
      value: 500,
      weight: 3.0,
      strength: 0,
      ac: 0,
      creatorId: gm.id,
      updatedAt: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (swordError) throw swordError

  await supabase.from('ItemTemplate').insert({
    id: id(),
    name: 'Armadura de Placas +1',
    description: 'Una armadura reluciente que ofrece gran protección.',
    rarity: 'RARE',
    category: 'Armor',
    value: 5000,
    weight: 65.0,
    ac: 19,
    creatorId: gm.id,
    updatedAt: new Date().toISOString(),
  })

  console.log('--- Creando Plantilla de Personaje ---')
  const { data: paladinTemplate, error: paladinError } = await supabase
    .from('CharacterTemplate')
    .insert({
      id: id(),
      name: 'Paladín de la Luz',
      description: 'Un guerrero sagrado dedicado a la justicia.',
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 14,
      ac: 18,
      speed: 30,
      authorId: gm.id,
      updatedAt: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (paladinError) throw paladinError

  console.log('--- Creando Personaje ---')
  const { data: character, error: charError } = await supabase
    .from('Character')
    .insert({
      id: id(),
      name: 'Valerius el Valiente',
      userId: player.id,
      campaignId: campaign.id,
      templateId: paladinTemplate.id,
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
      updatedAt: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (charError) throw charError

  console.log('--- Entregando Ítem al Personaje ---')
  await supabase.from('Item').insert({
    id: id(),
    name: 'Espada de Valerius',
    templateId: swordTemplate.id,
    characterId: character.id,
    campaignId: campaign.id,
    isEquipped: true,
    rarity: 'UNCOMMON',
    updatedAt: new Date().toISOString(),
  })

  console.log('--- Creando Monstruos (Bestiario) ---')
  const { data: wolfTemplate, error: wolfError } = await supabase
    .from('MonsterTemplate')
    .insert({
      id: id(),
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
      updatedAt: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (wolfError) throw wolfError

  console.log('--- Spawneando Monstruos en la Campaña ---')
  await supabase.from('ActiveMonster').insert({
    id: id(),
    name: 'Lobo Alfa',
    templateId: wolfTemplate.id,
    campaignId: campaign.id,
    maxHp: 22,
    currentHp: 22,
    strength: 14,
    ac: 14,
    updatedAt: new Date().toISOString(),
  })

  console.log('--- Creando Permisos de Acceso ---')
  await supabase.from('AccessGrant').insert({
    id: id(),
    granteeId: player.id,
    resourceType: 'CAMPAIGN',
    resourceId: campaign.id,
    access: 'VIEW',
    updatedAt: new Date().toISOString(),
  })

  console.log('✅ Semilla completada con éxito')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
