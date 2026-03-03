import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  console.log('📬 Nuevo webhook recibido de Clerk. Procesando...')
  // 1. Obtener el secreto del .env
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Obtener los headers de Svix para la validación
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // Si no hay headers, error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // 3. Obtener el cuerpo de la petición (body)
  const body = await req.text()

  // 4. Crear una nueva instancia de Svix con tu secreto
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // 5. Verificar la firma del webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // 6. Lógica de Sincronización con Prisma
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, username, image_url, primary_email_address_id } =
      evt.data

    // Buscar el email exacto marcado como primario en Clerk
    const primaryEmailObj = email_addresses.find((email) => email.id === primary_email_address_id)
    const email = primaryEmailObj
      ? primaryEmailObj.email_address
      : email_addresses[0]?.email_address

    if (!email) {
      console.error(`⚠️ Webhook Error: No email found for user ${id}`)
      return new Response('Error: No email provided', { status: 400 })
    }

    const displayName = first_name || username || 'Héroe sin nombre'

    const t0 = performance.now()
    console.log('🚀 Iniciando comunicación con Supabase...')

    const result = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        name: displayName,
        image: image_url,
        email: email,
      },
      create: {
        clerkId: id,
        email: email,
        name: displayName,
        image: image_url,
      },
    })

    const t1 = performance.now()
    console.log(`✅ Supabase respondió en ${Math.round(t1 - t0)}ms`)
    console.log('Datos guardados:', result.name)
  }

  if (eventType === 'user.deleted') {
    console.log('🗑️ Usuario eliminado en Clerk. Sincronizando eliminación en Supabase...')
    const { id } = evt.data

    await prisma.user.delete({
      where: { clerkId: id },
    })
  }

  return new Response('', { status: 200 })
}
