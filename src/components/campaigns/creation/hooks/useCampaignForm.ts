import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CAMPAIGN_CREATION_STEPS } from '@/config/campaign-steps'
import { CampaignFormValues } from '../types'
import { createCampaign } from '@/actions/campaign-actions'
import { sileo, Toaster } from 'sileo'

export function useCampaignForm() {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    mode: 'onChange',
  })

  const activeStep = CAMPAIGN_CREATION_STEPS[currentStepIndex]
  const isLastStep = currentStepIndex === CAMPAIGN_CREATION_STEPS.length - 1

  const onSubmit: SubmitHandler<CampaignFormValues> = async (data) => {
    // console.log('Portal abriendo con datos:', data)
    try {
      const response = await createCampaign({
        name: data.name,
        location: data.location,
      })

      if (response.success) {
        sileo.success({ title: response.message })
        router.push('/colosseum')
      } else {
        sileo.error({
          title: response.message || 'Error al crear la campaña',
          description: 'Inténtalo de nuevo más tarde.',
        })
      }
    } catch (error) {
      sileo.error({ title: 'Ocurrió un error inesperado al intentar crear la campaña' })
    }
  }

  const nextStep = async () => {
    const isValid = await trigger(activeStep.field as keyof CampaignFormValues)

    if (isValid || activeStep.optional) {
      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1)
      } else {
        handleSubmit(onSubmit)()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      nextStep()
    }
  }

  const skipStep = () => {
    if (activeStep.optional && !isLastStep) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const completedSteps = CAMPAIGN_CREATION_STEPS.slice(0, currentStepIndex)

  return {
    register,
    handleSubmit,
    errors,
    getValues,
    activeStep,
    isLastStep,
    nextStep,
    handleKeyDown,
    skipStep,
    onSubmit,
    completedSteps,
  }
}
