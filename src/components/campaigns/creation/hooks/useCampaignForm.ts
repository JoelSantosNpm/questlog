import { useRouter } from 'next/navigation'
import { useForm, useFormContext, SubmitHandler } from 'react-hook-form'
import { CAMPAIGN_CREATION_STEPS } from '@/config/campaign-steps'
import { CampaignFormValues } from '../types'
import { createCampaign } from '@/actions/campaign-actions'
import { notifyCampaignCreation } from '@/lib/notifications'
import { useCampaignStore } from '../store/campaignStore'

export function useInitCampaignForm() {
  const methods = useForm<CampaignFormValues>({ mode: 'onChange' })
  return methods
}

export function useCampaignActions() {
  const router = useRouter()
  const { trigger, handleSubmit } = useFormContext<CampaignFormValues>()

  const currentStepIndex = useCampaignStore((state) => state.currentStepIndex)
  const isTransitioning = useCampaignStore((state) => state.isTransitioning)
  const setIsTransitioning = useCampaignStore((state) => state.setIsTransitioning)
  const advanceStep = useCampaignStore((state) => state.advanceStep)
  const storeSkipStep = useCampaignStore((state) => state.skipStep)

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
      console.error(error)
    }
  }

  const nextStep = async () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    const isValid = await trigger(activeStep.field as keyof CampaignFormValues)

    if (isValid || activeStep.optional) {
      if (!isLastStep) {
        advanceStep()
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
      storeSkipStep()
      setTimeout(() => setIsTransitioning(false), 2600)
    }
  }

  return {
    activeStep,
    isLastStep,
    nextStep,
    handleFormSubmit,
    skipStep,
    completedSteps: CAMPAIGN_CREATION_STEPS.slice(0, currentStepIndex),
    isTransitioning,
  }
}
