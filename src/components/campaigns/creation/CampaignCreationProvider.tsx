'use client'

import React from 'react'
import { FormProvider } from 'react-hook-form'
import { CampaignCreationForm } from './CampaignCreationForm'
import { useInitCampaignForm } from './hooks/useCampaignForm'

export default function CampaignCreationProvider() {
  const methods = useInitCampaignForm()

  return (
    <FormProvider {...methods}>
      <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
        <CampaignCreationForm />
      </div>
    </FormProvider>
  )
}
