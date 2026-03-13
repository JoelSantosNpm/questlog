'use client'

import React, { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { CampaignCreationForm } from './CampaignCreationForm'
import { useInitCampaignForm } from './hooks/useCampaignForm'
import { useCampaignStore } from './store/campaignStore'

export default function CampaignCreationProvider() {
  const methods = useInitCampaignForm()
  const reset = useCampaignStore((state) => state.reset)

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <FormProvider {...methods}>
      <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
        <CampaignCreationForm />
      </div>
    </FormProvider>
  )
}
