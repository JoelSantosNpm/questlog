import type { BestiaryItem, CastItem, MuseumItem } from '../model/types'

export async function fetchBestiaryItems(): Promise<BestiaryItem[]> {
  const res = await fetch('/api/encyclopedia/bestiary')
  if (!res.ok) throw new Error('Failed to fetch bestiary')
  return res.json()
}

export async function fetchCharacterTemplates(): Promise<CastItem[]> {
  const res = await fetch('/api/encyclopedia/cast')
  if (!res.ok) throw new Error('Failed to fetch character templates')
  return res.json()
}

export async function fetchMuseumItems(): Promise<MuseumItem[]> {
  const res = await fetch('/api/encyclopedia/museum')
  if (!res.ok) throw new Error('Failed to fetch museum items')
  return res.json()
}
