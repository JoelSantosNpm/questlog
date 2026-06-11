import { EditableStatBox } from '@/views/encyclopedia/ui/monster-creation/EditableStatBox'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EditableStatBox', () => {
  describe('Renderizado', () => {
    it('muestra el label del stat', () => {
      render(<EditableStatBox label="FUE" />)
      expect(screen.getByText('FUE')).toBeInTheDocument()
    })

    it('renderiza un input de tipo number', () => {
      render(<EditableStatBox label="FUE" />)
      expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    })

    it('aplica el title al contenedor para tooltip', () => {
      render(<EditableStatBox label="FUE" title="Fuerza" />)
      expect(screen.getByTitle('Fuerza')).toBeInTheDocument()
    })

    it('muestra el defaultValue en el input', () => {
      render(<EditableStatBox label="FUE" defaultValue={14} />)
      expect(screen.getByRole('spinbutton')).toHaveValue(14)
    })

    it('reenvía props adicionales al input (name, placeholder)', () => {
      render(<EditableStatBox label="FUE" name="strength" placeholder="0" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('name', 'strength')
      expect(input).toHaveAttribute('placeholder', '0')
    })
  })

  describe('Dimensiones SVG según boxSize', () => {
    it('en boxSize "md" el contenedor tiene mayor tamaño que en "sm"', () => {
      const { rerender, container } = render(<EditableStatBox label="X" boxSize="md" />)
      const mdWidth = parseInt((container.firstChild as HTMLElement).style.width)

      rerender(<EditableStatBox label="X" boxSize="sm" />)
      const smWidth = parseInt((container.firstChild as HTMLElement).style.width)

      expect(mdWidth).toBeGreaterThan(smWidth)
    })
  })
})
