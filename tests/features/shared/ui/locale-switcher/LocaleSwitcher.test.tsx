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
  it('muestra el locale activo en el botón y el menú está cerrado por defecto', () => {
    render(<LocaleSwitcher currentLocale='es' />)
    expect(screen.getByRole('button', { name: /ES/ })).toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('al hacer click en el botón se abre el menú con una opción por locale, marcando la activa', () => {
    render(<LocaleSwitcher currentLocale='es' />)
    fireEvent.click(screen.getByRole('button', { name: /ES/ }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: /ES/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: /EN/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('no hace nada al hacer click en la opción ya activa', () => {
    render(<LocaleSwitcher currentLocale='es' />)
    fireEvent.click(screen.getByRole('button', { name: /ES/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /ES/ }))

    expect(mockRefresh).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('setea la cookie NEXT_LOCALE, llama a router.refresh y cierra el menú al elegir otro idioma', () => {
    render(<LocaleSwitcher currentLocale='es' />)
    fireEvent.click(screen.getByRole('button', { name: /ES/ }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /EN/ }))

    expect(document.cookie).toContain('NEXT_LOCALE=en')
    expect(mockRefresh).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('cierra el menú al hacer click fuera del componente', () => {
    render(<LocaleSwitcher currentLocale='es' />)
    fireEvent.click(screen.getByRole('button', { name: /ES/ }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
