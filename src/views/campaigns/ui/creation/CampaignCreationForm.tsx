'use client'

import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useCampaignActions } from '../../lib/useCampaignForm'
import { CampaignFormValues } from '../../model/campaign-types'
import { StepControls } from './StepControls'

export function CampaignCreationForm() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<CampaignFormValues>()
  const {
    completedSteps,
    activeStep,
    isTransitioning: disabled,
    handleFormSubmit,
  } = useCampaignActions()

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [activeStep.id, disabled])

  return (
    <form
      onSubmit={handleFormSubmit}
      className='w-full relative min-h-[50vh] flex flex-col justify-center'
    >
      <LazyMotion features={domAnimation}>
        <div className='mb-8 text-center text-lg md:text-xl font-light tracking-wide text-zinc-300 leading-relaxed max-w-2xl mx-auto'>
          {/* Todo el texto (historial + activo) fluye como un solo párrafo inline */}
          <div className='inline'>
            {/* Historial ya completado */}
            <AnimatePresence initial={false}>
              {completedSteps.map((step) => (
                <m.span
                  key={step.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 2 }}
                  className='inline'
                >
                  <span>{step.narrativeBefore}</span>
                  <span className='text-amber-500 font-medium px-1'>
                    {getValues(step.field as keyof CampaignFormValues) || '...'}
                  </span>
                  <span className='mr-1'>{step.narrativeAfter}</span>
                </m.span>
              ))}
            </AnimatePresence>

            {/* Paso Actual Integrado */}
            <AnimatePresence mode='wait'>
              <m.div
                key={activeStep.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 2 } }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
                className='block text-xl md:text-2xl text-zinc-100 relative mt-4'
              >
                <span>{activeStep.narrativeBefore}</span>
                <span className='relative inline-block border-b-2 border-amber-500/30 focus-within:border-amber-500 transition-colors px-1 mx-1 min-w-50'>
                  <input
                    id={activeStep.field}
                    {...register(activeStep.field as keyof CampaignFormValues, {
                      required: !activeStep.optional
                        ? 'Este campo es vital para tu crónica.'
                        : false,
                    })}
                    ref={(el) => {
                      register(activeStep.field as keyof CampaignFormValues).ref(el)
                      inputRef.current = el
                    }}
                    disabled={disabled}
                    placeholder={activeStep.placeholder}
                    className='bg-transparent border-none outline-none text-center text-amber-500 font-medium w-full placeholder:text-zinc-600/50 caret-amber-500 appearance-none focus:ring-0 px-1'
                    autoComplete='off'
                    aria-invalid={!!errors[activeStep.field as keyof CampaignFormValues]}
                    aria-describedby={
                      errors[activeStep.field as keyof CampaignFormValues]
                        ? `${activeStep.field}-error`
                        : undefined
                    }
                  />

                  {/* Error Flotante */}
                  {errors[activeStep.field as keyof CampaignFormValues] && (
                    <span
                      id={`${activeStep.field}-error`}
                      className='absolute top-full left-1/2 -translate-x-1/2 text-red-500 text-sm whitespace-nowrap mt-2 pointer-events-none'
                      role='alert'
                    >
                      {errors[activeStep.field as keyof CampaignFormValues]?.message as string}
                    </span>
                  )}
                </span>
                <span className='mr-1'>{activeStep.narrativeAfter}</span>

                {/* Controles renderizados simultáneamente con el bloque de texto */}
                <StepControls />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </LazyMotion>
    </form>
  )
}
