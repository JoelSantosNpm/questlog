import { motion } from 'framer-motion'

interface StepControlsProps {
  isLastStep: boolean
  isOptional: boolean
  onNext: () => void
  onSkip: () => void
}

export function StepControls({ isLastStep, isOptional, onNext, onSkip }: StepControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className='mt-12 flex items-center justify-center gap-6 w-full'
    >
      {isOptional && !isLastStep && (
        <button
          type='button'
          onClick={onSkip}
          className='px-4 py-2 rounded-md text-sm text-zinc-500 hover:text-zinc-300 transition-colors'
        >
          Saltar este paso
        </button>
      )}

      {!isLastStep ? (
        <button
          type='button'
          onClick={onNext}
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
  )
}
