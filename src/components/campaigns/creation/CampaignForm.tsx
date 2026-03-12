'use client'

import React from 'react'
import { FormProvider } from 'react-hook-form'
import { NarrativeBlock } from './NarrativeBlock'
import { useInitCampaignForm, useCampaignActions } from './hooks/useCampaignForm'

function FormInner() {
  const { handleFormSubmit } = useCampaignActions()

  return (
    <form
      onSubmit={handleFormSubmit}
      className='w-full relative min-h-[50vh] flex flex-col justify-center'
    >
      <NarrativeBlock />
    </form>
  )
}

export default function CampaignForm() {
  const methods = useInitCampaignForm()

  return (
    <FormProvider {...methods}>
      <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
        <FormInner />
      </div>
    </FormProvider>
  )
}
