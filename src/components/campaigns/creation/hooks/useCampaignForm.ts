import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CAMPAIGN_CREATION_STEPS } from '@/config/campaign-steps'
import { CampaignFormValues } from '../types'
import { createCampaign } from '@/actions/campaign-actions'
import { notifyCampaignCreation } from '@/lib/notifications'

export function useCampaignForm() {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
    const createPromise = async () => {
      const response = await createCampaign({
        name: data.name,
        location: data.location,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error al esculpir la campaña')
      }

      return response.data
    }

    try {
      const campaign = await notifyCampaignCreation(createPromise())

      if (campaign) {
        router.push(`/campaigns/${campaign.id}`)
      }
    } catch (error) {
      // El error ya es manejado por el toast
      console.error(error)
    }
  }

  const nextStep = async () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    const isValid = await trigger(activeStep.field as keyof CampaignFormValues)

    if (isValid || activeStep.optional) {
      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1)
        // Damos tiempo a la animación para completarse (salida + entada ~ 2.6s)
        setTimeout(() => setIsTransitioning(false), 2600)
      } else {
        setIsTransitioning(false)
        handleSubmit(onSubmit)()
      }
    } else {
      setIsTransitioning(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isLastStep) {
      e.preventDefault()
      nextStep()
      return
    }
    handleSubmit(onSubmit)(e)
  }

  const skipStep = () => {
    if (isTransitioning) return
    if (activeStep.optional && !isLastStep) {
      setIsTransitioning(true)
      setCurrentStepIndex((prev) => prev + 1)
      setTimeout(() => setIsTransitioning(false), 2600)
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
    handleFormSubmit,
    skipStep,
    completedSteps,
    isTransitioning,
  }
}
