import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import type { Campaign } from '@prisma/client'
import type React from 'react'

import {
  CampaignCreationForm,
  useCampaignStore,
  type CampaignFormValues,
} from '@/views/campaigns/ui/creation'
import * as campaignActions from '@/views/campaigns/api/campaign-actions'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/views/campaigns/api/campaign-actions', () => ({
  createCampaign: vi.fn(),
}))

// notifyCampaignCreation actúa como pass-through: devuelve la misma promise
vi.mock('@/views/campaigns/lib/notifications', () => ({
  notifyCampaignCreation: (promise: Promise<unknown>) => promise,
}))

// framer-motion: renderiza hijos directamente, sin animaciones
vi.mock('framer-motion', () => ({
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  domAnimation: {},
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  m: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    span: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  },
}))

// ─── Helper ───────────────────────────────────────────────────────────────────

function FormWrapper({
  children,
  defaultValues = { name: '', location: '' },
}: {
  children: React.ReactNode
  defaultValues?: Partial<CampaignFormValues>
}) {
  const methods = useForm<CampaignFormValues>({ mode: 'onChange', defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CampaignCreationForm', () => {
  beforeEach(() => {
    useCampaignStore.getState().reset()
    vi.clearAllMocks()
  })

  // AC 2.1 ─────────────────────────────────────────────────────────────────────
  describe('AC 2.1 – FormProvider envuelve los inputs del formulario', () => {
    it('renderiza el input del paso activo conectado al contexto del formulario', () => {
      render(
        <FormWrapper>
          <CampaignCreationForm />
        </FormWrapper>
      )

      const input = screen.getByPlaceholderText('el nombre de tu gesta')

      expect(input).toBeInTheDocument()
      expect(input.tagName).toBe('INPUT')
      expect(input).toHaveAttribute('id', 'name')
      // Verifica que el input está deshabilitado sólo cuando isTransitioning es true
      expect(input).not.toBeDisabled()
    })
  })

  // AC 2.2 ─────────────────────────────────────────────────────────────────────
  describe('AC 2.2 – Validación: nombre obligatorio vacío', () => {
    it('muestra el error de validación si se intenta avanzar sin rellenar el nombre', async () => {
      render(
        <FormWrapper>
          <CampaignCreationForm />
        </FormWrapper>
      )

      // El input vacío y se hace click en "Continuar"
      fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Este campo es vital para tu crónica.')
      })
    })

    it('no avanza de paso si el nombre está vacío', async () => {
      render(
        <FormWrapper>
          <CampaignCreationForm />
        </FormWrapper>
      )

      fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      expect(useCampaignStore.getState().currentStepIndex).toBe(0)
    })

    it('no muestra error si el nombre está relleno', async () => {
      render(
        <FormWrapper>
          <CampaignCreationForm />
        </FormWrapper>
      )

      const input = screen.getByPlaceholderText('el nombre de tu gesta')
      fireEvent.change(input, { target: { value: 'La Gran Aventura' } })
      fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  // AC 2.3 ─────────────────────────────────────────────────────────────────────
  describe('AC 2.3 – Envío exitoso del formulario', () => {
    it('llama a createCampaign con los datos correctos al hacer submit en el último paso', async () => {
      const mockCampaign = { id: 'campaign-42', name: 'Leyenda Dorada' }

      vi.mocked(campaignActions.createCampaign).mockResolvedValueOnce({
        success: true,
        message: 'Campaña creada',
        data: mockCampaign as Campaign,
      })

      // Forzar el store al último paso (location)
      useCampaignStore.setState({ currentStepIndex: 1, isTransitioning: false })

      const { container } = render(
        <FormWrapper defaultValues={{ name: 'Leyenda Dorada', location: 'Neverwinter' }}>
          <CampaignCreationForm />
        </FormWrapper>
      )

      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(campaignActions.createCampaign).toHaveBeenCalledWith({
          name: 'Leyenda Dorada',
          location: 'Neverwinter',
        })
      })
    })

    it('no llama a createCampaign si el formulario está en transición', async () => {
      // isTransitioning bloquea el submit
      useCampaignStore.setState({ currentStepIndex: 1, isTransitioning: true })

      const { container } = render(
        <FormWrapper defaultValues={{ name: 'Leyenda Dorada', location: 'Neverwinter' }}>
          <CampaignCreationForm />
        </FormWrapper>
      )

      fireEvent.submit(container.querySelector('form')!)

      // La llamada no debe ocurrir porque el submit está bloqueado
      expect(campaignActions.createCampaign).not.toHaveBeenCalled()
    })
  })
})
