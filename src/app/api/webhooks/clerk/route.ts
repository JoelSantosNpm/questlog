import { prismaAdmin } from '@/shared/lib/prisma'
import { createClient } from '@/shared/lib/supabase/server'
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

/**
 * Borra recursivamente todos los archivos de una carpeta en questlog-assets.
 * Supabase Storage no tiene operación "delete folder" — hay que listar y borrar.
 */
async function deleteStorageFolder(supabase: ReturnType<typeof createClient>, prefix: string) {
  const { data: items, error } = await supabase.storage.from('questlog-assets').list(prefix)
  if (error || !items?.length) return

  const filePaths: string[] = []
  const folderPrefixes: string[] = []

  for (const item of items) {
    if (item.id) {
      // Es un archivo
      filePaths.push(`${prefix}/${item.name}`)
    } else {
      // Es una subcarpeta (id === null en Supabase Storage)
      folderPrefixes.push(`${prefix}/${item.name}`)
    }
  }

  if (filePaths.length) {
    await supabase.storage.from('questlog-assets').remove(filePaths)
  }

  for (const folder of folderPrefixes) {
    await deleteStorageFolder(supabase, folder)
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

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

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses[0]?.email_address
    const name = `${first_name || ''} ${last_name || ''}`.trim()

    try {
      await prismaAdmin.user.upsert({
        where: { clerkId: id },
        update: {
          email: email,
          name: name,
          image: image_url,
          updatedAt: new Date(),
        },
        create: {
          clerkId: id as string,
          email: email,
          name: name,
          image: image_url,
        },
      })
    } catch (error) {
      console.error('❌ Error syncing user via Webhook:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const supabase = createClient()
      await deleteStorageFolder(supabase, id as string)
      await prismaAdmin.user.delete({
        where: { clerkId: id },
      })
    } catch (error) {
      console.error('❌ Error deleting user via Webhook:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}
