'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { CAMPAIGN_CREATION_STEPS } from '@/config/campaign-steps'

type CampaignFormValues = {
  name: string
  landName?: string
  startingPoint?: string
  atmosphere?: string
  rumors?: string
}

export default function CampaignForm() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Enfocar el input cuando cambie el paso
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentStepIndex])

  const nextStep = async () => {
    // Validar el campo actual antes de avanzar
    const isValid = await trigger(activeStep.field as keyof CampaignFormValues)

    // Si es opcional o es válido, avanzamos
    if (isValid || activeStep.optional) {
      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1)
      } else {
        // Ejecutar submit manualmente en el último enter si se requiere
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

  const onSubmit: SubmitHandler<CampaignFormValues> = async (data) => {
    console.log('Portal abriéndose con datos:', data)
    // TODO: Connect to server action or API
  }

  // Obtener los pasos completados
  const completedSteps = CAMPAIGN_CREATION_STEPS.slice(0, currentStepIndex)

  return (
    <div className='w-full max-w-3xl mx-auto p-6 flex flex-col items-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full relative min-h-[50vh] flex flex-col justify-center'
      >
        {/* Historial de la narrativa */}
        <div className='mb-8 text-left text-lg md:text-xl font-light tracking-wide text-zinc-300 leading-relaxed'>
          <AnimatePresence initial={false}>
            {completedSteps.map((step) => (
              <motion.span
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.4, x: 0 }}
                className='inline' // Forzamos que se mantenga en línea
              >
                <span>{step.narrativeBefore}</span>
                <span className='text-amber-500 font-medium mx-1'>
                  {getValues(step.field as keyof CampaignFormValues) || '...'}
                </span>
                <span>{step.narrativeAfter} </span>{' '}
                {/* Espacio extra al final para el siguiente paso */}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Aquí iría el input del paso actual, también como un elemento inline */}
        </div>

        {/* Paso Actual */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className='text-center text-xl md:text-3xl font-light text-zinc-100 flex flex-wrap items-center justify-center gap-y-3 gap-x-2 leading-loose'
          >
            <span>{activeStep.narrativeBefore}</span>
            <div className='relative inline-block border-b-2 border-amber-500/30 focus-within:border-amber-500 transition-colors px-1'>
              <input
                {...register(activeStep.field as keyof CampaignFormValues, {
                  required: !activeStep.optional ? 'Este campo es vital para tu crónica.' : false,
                })}
                onKeyDown={handleKeyDown}
                placeholder={activeStep.placeholder}
                className='bg-transparent border-none outline-none text-center text-amber-500 font-medium w-full min-w-50 placeholder:text-zinc-600/50 caret-amber-500 appearance-none focus:ring-0'
                autoComplete='off'
                autoFocus
              />
            </div>
            <span>{activeStep.narrativeAfter}</span>

            {errors[activeStep.field as keyof CampaignFormValues] && (
              <span className='text-red-500 text-sm w-full block mt-2'>
                {errors[activeStep.field as keyof CampaignFormValues]?.message as string}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controles del Paso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-12 flex items-center justify-center gap-6'
        >
          {activeStep.optional && !isLastStep && (
            <button
              type='button'
              onClick={skipStep}
              className='px-4 py-2 rounded-md text-sm text-zinc-500 hover:text-zinc-300 transition-colors'
            >
              Saltar este paso
            </button>
          )}

          {!isLastStep ? (
            <button
              type='button'
              onClick={nextStep}
              className='px-8 py-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/50 shadow-lg backdrop-blur-sm transition-all flex items-center gap-2 group'
            >
              Continuar
              <span className='group-hover:translate-x-1 transition-transform'>→</span>
            </button>
          ) : (
            <button
              type='submit'
              className='px-10 py-4 rounded-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-sm transition-all text-lg font-medium tracking-wide'
            >
              Abrir Portal
            </button>
          )}
        </motion.div>
      </form>
    </div>
  )
}
