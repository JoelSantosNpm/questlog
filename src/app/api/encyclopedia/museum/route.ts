import { getMuseumItems } from '@/views/encyclopedia/api/encyclopedia-queries'

export async function GET() {
  try {
    const data = await getMuseumItems()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch museum items' }, { status: 500 })
  }
}
