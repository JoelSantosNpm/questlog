import { motion, AnimatePresence } from 'framer-motion'
import { UseFormRegister, FieldErrors, UseFormGetValues } from 'react-hook-form'
import { CampaignStep } from '@/config/campaign-steps'
import { CampaignFormValues } from './types'
import { StepControls } from './StepControls'

interface NarrativeBlockProps {
  completedSteps: CampaignStep[]
  activeStep: CampaignStep
  getValues: UseFormGetValues<CampaignFormValues>
  register: UseFormRegister<CampaignFormValues>
  errors: FieldErrors<CampaignFormValues>
  disabled?: boolean
  isLastStep: boolean
  onNext: () => void
  onSkip: () => void
}

export function NarrativeBlock({
  completedSteps,
  activeStep,
  getValues,
  register,
  errors,
  disabled,
  isLastStep,
  onNext,
  onSkip,
}: NarrativeBlockProps) {
  return (
    <div className='mb-8 text-center text-lg md:text-xl font-light tracking-wide text-zinc-300 leading-relaxed max-w-2xl mx-auto'>
      {/* Todo el texto (historial + activo) fluye como un solo párrafo inline */}
      <div className='inline'>
        {/* Historial ya completado */}
        <AnimatePresence initial={false}>
          {completedSteps.map((step) => (
            <motion.span
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
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Paso Actual Integrado */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 2 } }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className='block text-xl md:text-2xl text-zinc-100 relative mt-4'
          >
            <span>{activeStep.narrativeBefore}</span>
            <span className='relative inline-block border-b-2 border-amber-500/30 focus-within:border-amber-500 transition-colors px-1 mx-1 min-w-[200px]'>
              <input
                id={activeStep.field}
                {...register(activeStep.field as keyof CampaignFormValues, {
                  required: !activeStep.optional ? 'Este campo es vital para tu crónica.' : false,
                })}
                disabled={disabled}
                placeholder={activeStep.placeholder}
                className='bg-transparent border-none outline-none text-center text-amber-500 font-medium w-full placeholder:text-zinc-600/50 caret-amber-500 appearance-none focus:ring-0 px-1'
                autoComplete='off'
                autoFocus
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
            <StepControls
              isLastStep={isLastStep}
              isOptional={activeStep.optional}
              onNext={onNext}
              onSkip={onSkip}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
