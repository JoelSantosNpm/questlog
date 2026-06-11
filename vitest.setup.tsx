import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ─── Mocks globales ────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} />
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('lucide-react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('lucide-react')>()
  return {
    ...mod,
    OctagonAlert: () => <svg data-testid="icon-octagon-alert" />,
    Info: () => <svg data-testid="icon-info" />,
  }
})

vi.mock('sileo', () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn().mockReturnValue({ userId: null, isLoaded: true }),
}))

vi.mock('next-intl', async () => {
  const { makeUseTranslations } = await import('./tests/mocks/intl')
  return { useTranslations: makeUseTranslations() }
})
