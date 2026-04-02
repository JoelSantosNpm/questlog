'use client'

import { useRef } from 'react'
import { useEncyclopediaStore, type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem } from '../model/encyclopedia'

interface Props {
  data: Record<EncyclopediaSection, EncyclopediaItem[]>
}

export function EncyclopediaStoreInitializer({ data }: Props) {
  const initialized = useRef(false)

  if (!initialized.current) {
    useEncyclopediaStore.getState().setItems(data)
    initialized.current = true
  }

  return null
}
