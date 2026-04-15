'use client'

import React, { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { CampaignCreationForm } from './CampaignCreationForm'
import { useInitCampaignForm } from '../../lib/useCampaignForm'
import { useCampaignStore } from '../../model/campaignStore'

export default function CampaignCreationProvider() {
  const methods = useInitCampaignForm()
  const reset = useCampaignStore((state) => state.reset)

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <FormProvider {...methods}>
      <div className='w-full max-w-3xl mx-auto p-3 flex flex-col items-center'>
        <CampaignCreationForm />
      </div>
    </FormProvider>
  )
}
