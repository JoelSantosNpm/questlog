'use client'

import React from 'react'
import { NarrativeBlock } from './NarrativeBlock'
import { StepControls } from './StepControls'
import { useCampaignForm } from './hooks/useCampaignForm'

export default function CampaignForm() {
  const {
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
  } = useCampaignForm()

  return (
    <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full relative min-h-[50vh] flex flex-col justify-center'
      >
        <NarrativeBlock
          completedSteps={completedSteps}
          activeStep={activeStep}
          getValues={getValues}
          register={register}
          errors={errors}
          onKeyDown={handleKeyDown}
        />

        <StepControls
          isLastStep={isLastStep}
          isOptional={activeStep.optional}
          onNext={nextStep}
          onSkip={skipStep}
        />
      </form>
    </div>
  )
}
