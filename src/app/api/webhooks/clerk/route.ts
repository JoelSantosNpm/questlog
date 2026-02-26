import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
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
  const payload = await req.json()
  const body = JSON.stringify(payload)

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
    const { id, email_addresses, first_name, image_url } = evt.data
    const email = email_addresses[0]?.email_address

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email,
        name: first_name || '',
        image: image_url,
      },
      create: {
        clerkId: id,
        email: email,
        name: first_name || '',
        image: image_url,
      },
    })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    await prisma.user.delete({
      where: { clerkId: id },
    })
    // Nota: Gracias al "onDelete: Cascade" en tu schema,
    // esto borrará automáticamente sus campañas y personajes.
  }

  return new Response('', { status: 200 })
}
