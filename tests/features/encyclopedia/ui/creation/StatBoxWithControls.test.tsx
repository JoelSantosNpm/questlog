import {
  DEFAULT_MONSTER_FORM_VALUES,
  type MonsterFormFields,
} from '@/views/encyclopedia/ui/monster-creation/monster-form-fields'
import { StatBoxWithControls } from '@/views/encyclopedia/ui/creation/StatBoxWithControls'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'

// ─── Helper ───────────────────────────────────────────────────────────────────

function FormWrapper({
  children,
  defaultValues,
}: {
  children: ReactNode
  defaultValues?: Partial<MonsterFormFields>
}) {
  const methods = useForm<MonsterFormFields>({
    defaultValues: { ...DEFAULT_MONSTER_FORM_VALUES, ...defaultValues },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('StatBoxWithControls', () => {
  describe('Renderizado', () => {
    it('muestra el label del stat', () => {
      render(
        <FormWrapper>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      expect(screen.getByText('FUE')).toBeInTheDocument()
    })

    it('renderiza los botones + y −', () => {
      render(
        <FormWrapper>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument()
    })

    it('muestra el valor inicial del campo', () => {
      render(
        <FormWrapper defaultValues={{ strength: 14 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      expect(screen.getByRole('spinbutton')).toHaveValue(14)
    })

    it('aplica el atributo title al contenedor del hex', () => {
      render(
        <FormWrapper>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" title="Fuerza" />
        </FormWrapper>
      )
      expect(screen.getByTitle('Fuerza')).toBeInTheDocument()
    })
  })

  describe('Incremento y decremento', () => {
    it('incrementa el valor en 1 al hacer click en +', async () => {
      render(
        <FormWrapper defaultValues={{ strength: 10 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(11))
    })

    it('decrementa el valor en 1 al hacer click en −', async () => {
      render(
        <FormWrapper defaultValues={{ strength: 10 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '−' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(9))
    })

    it('clicks consecutivos acumulan el cambio', async () => {
      render(
        <FormWrapper defaultValues={{ strength: 10 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="strength" label="FUE" />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(13))
    })
  })

  describe('Restricción de mínimo', () => {
    it('no permite decrementar por debajo del mínimo', async () => {
      render(
        <FormWrapper defaultValues={{ maxHp: 1 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="maxHp" label="PG" min={1} />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '−' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(1))
    })

    it('sí permite incrementar desde el mínimo', async () => {
      render(
        <FormWrapper defaultValues={{ maxHp: 1 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="maxHp" label="PG" min={1} />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '+' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(2))
    })

    it('sin min definido permite valores negativos', async () => {
      render(
        <FormWrapper defaultValues={{ initiativeBonus: 0 }}>
          <StatBoxWithControls<MonsterFormFields> fieldKey="initiativeBonus" label="INI" />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: '−' }))
      await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(-1))
    })
  })
})
