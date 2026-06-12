import { LocaleSwitcher } from '@/shared/ui/locale-switcher/LocaleSwitcher'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockRefresh } = vi.hoisted(() => ({
  mockRefresh: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: mockRefresh }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  document.cookie = 'NEXT_LOCALE=; path=/; max-age=0'
})

describe('LocaleSwitcher', () => {
  it('marca como activo el pill correspondiente a currentLocale', () => {
    render(<LocaleSwitcher currentLocale="es" />)
    expect(screen.getByRole('button', { name: 'ES' }).className).toMatch(/amber/)
    expect(screen.getByRole('button', { name: 'EN' }).className).not.toMatch(/amber/)
  })

  it('no hace nada al hacer click en el pill ya activo', () => {
    render(<LocaleSwitcher currentLocale="es" />)
    fireEvent.click(screen.getByRole('button', { name: 'ES' }))
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  it('setea la cookie NEXT_LOCALE y llama a router.refresh al cambiar de idioma', () => {
    render(<LocaleSwitcher currentLocale="es" />)
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(document.cookie).toContain('NEXT_LOCALE=en')
    expect(mockRefresh).toHaveBeenCalledOnce()
  })
})
