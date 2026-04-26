'use client'

//Es el hook estándar de React para suscribirse a fuentes de datos externas al "mundo React" (como las APIs del navegador).

//Beneficio: React se encarga de gestionar la suscripción a los cambios del viewport de forma nativa. Es más eficiente,
// evita inconsistencias en el renderizado concurrente y es la forma recomendada de leer el estado del navegador.

import { useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string) => {
  const subscribe = (callback: () => void) => {
    const matchMedia = window.matchMedia(query)
    matchMedia.addEventListener('change', callback)
    return () => matchMedia.removeEventListener('change', callback)
  }

  const getSnapshot = () => window.matchMedia(query).matches

  const getServerSnapshot = () => {
    // We return a sensible default for the server (e.g., desktop-first)
    // or handle it with dynamic imports in the component.
    return false
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
