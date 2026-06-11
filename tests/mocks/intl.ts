import es from '../../messages/es.json'

function resolveKey(ns: string, key: string): string {
  const nsObj = ns.split('.').reduce((acc: unknown, k: string) => {
    return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined
  }, es as unknown)

  if (!nsObj || typeof nsObj !== 'object') return key

  const obj = nsObj as Record<string, unknown>

  if (typeof obj[key] === 'string') return obj[key] as string

  const dotted = key.split('.').reduce((acc: unknown, k: string) => {
    return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined
  }, obj as unknown)

  return typeof dotted === 'string' ? dotted : key
}

export function makeUseTranslations() {
  return (ns: string) => (key: string) => resolveKey(ns, key)
}
