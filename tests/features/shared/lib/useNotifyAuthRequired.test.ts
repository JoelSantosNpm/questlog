import { useNotifyAuthRequired } from '@/shared/lib/useNotifyAuthRequired'
import { renderHook } from '@testing-library/react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────


// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useNotifyAuthRequired', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve una función', () => {
    const { result } = renderHook(() => useNotifyAuthRequired())
    expect(typeof result.current).toBe('function')
  })

  it('llama a sileo.warning al invocar la función retornada', () => {
    const { result } = renderHook(() => useNotifyAuthRequired())
    result.current()
    expect(sileo.warning).toHaveBeenCalledOnce()
  })

  it('pasa el título y descripción traducidos al toast', () => {
    const { result } = renderHook(() => useNotifyAuthRequired())
    result.current()
    expect(sileo.warning).toHaveBeenCalledWith({
      title: 'Sesión requerida',
      description: 'Debes iniciar sesión para guardar los cambios.',
    })
  })

  it('no llama a sileo.warning hasta que se invoca el callback', () => {
    renderHook(() => useNotifyAuthRequired())
    expect(sileo.warning).not.toHaveBeenCalled()
  })

  it('puede invocarse múltiples veces produciendo un toast por llamada', () => {
    const { result } = renderHook(() => useNotifyAuthRequired())
    result.current()
    result.current()
    expect(sileo.warning).toHaveBeenCalledTimes(2)
  })
})
