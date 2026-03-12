'use client'

import React from 'react'
import { NarrativeBlock } from './NarrativeBlock'
import { useCampaignForm } from './hooks/useCampaignForm'

export default function CampaignForm() {
  const {
    register,
    errors,
    getValues,
    activeStep,
    isLastStep,
    nextStep,
    handleFormSubmit,
    skipStep,
    completedSteps,
    isTransitioning,
  } = useCampaignForm()

  return (
    <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
      <form
        onSubmit={handleFormSubmit}
        className='w-full relative min-h-[50vh] flex flex-col justify-center'
      >
        <NarrativeBlock
          completedSteps={completedSteps}
          activeStep={activeStep}
          getValues={getValues}
          register={register}
          errors={errors}
          disabled={isTransitioning}
          isLastStep={isLastStep}
          onNext={nextStep}
          onSkip={skipStep}
        />
      </form>
    </div>
  )
}
