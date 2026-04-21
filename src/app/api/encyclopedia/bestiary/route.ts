import { getBestiaryItems } from '@/views/encyclopedia/api/encyclopedia-queries'

export async function GET() {
  try {
    const data = await getBestiaryItems()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch bestiary' }, { status: 500 })
  }
}
