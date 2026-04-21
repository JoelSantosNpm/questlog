import { getCharacterTemplates } from '@/views/encyclopedia/api/encyclopedia-queries'

export async function GET() {
  try {
    const data = await getCharacterTemplates()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch character templates' }, { status: 500 })
  }
}
