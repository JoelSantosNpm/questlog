import { cn } from '@/shared/utils/styles'
import { Upload } from 'lucide-react'

export function UploaderEmptyState({ isDragging }: { isDragging: boolean }) {
  return (
    <div className='relative flex flex-col items-center justify-center p-6 space-y-4 text-center w-full h-full'>
      {/* Esquinas decorativas estilo marco de dibujo */}
      <div
        className={cn(
          'absolute top-4 left-4 w-3 h-3 border-t border-l border-neutral-800/60 transition-all duration-500',
          isDragging
            ? 'top-2 left-2 border-amber-700'
            : 'group-hover:top-3 group-hover:left-3 group-hover:border-neutral-700'
        )}
      />
      <div
        className={cn(
          'absolute top-4 right-4 w-3 h-3 border-t border-r border-neutral-800/60 transition-all duration-500',
          isDragging
            ? 'top-2 right-2 border-amber-700'
            : 'group-hover:top-3 group-hover:right-3 group-hover:border-neutral-700'
        )}
      />
      <div
        className={cn(
          'absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neutral-800/60 transition-all duration-500',
          isDragging
            ? 'bottom-2 left-2 border-amber-700'
            : 'group-hover:bottom-3 group-hover:left-3 group-hover:border-neutral-700'
        )}
      />
      <div
        className={cn(
          'absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neutral-800/60 transition-all duration-500',
          isDragging
            ? 'bottom-2 right-2 border-amber-700'
            : 'group-hover:bottom-3 group-hover:right-3 group-hover:border-neutral-700'
        )}
      />

      <div
        className={cn(
          'relative p-4 bg-neutral-900/40 rounded-full border border-neutral-800 group-hover:border-amber-900/40 transition-all duration-500 shadow-xl',
          isDragging && 'scale-110 bg-amber-950/20 border-amber-700'
        )}
      >
        <Upload
          className={cn(
            'w-6 h-6 transition-colors duration-500',
            isDragging ? 'text-amber-500' : 'text-neutral-700 group-hover:text-amber-700'
          )}
        />
      </div>

      <div className='relative space-y-1.5'>
        <p
          className={cn(
            'text-[10px] font-bold transition-colors duration-500 uppercase tracking-[0.3em]',
            isDragging ? 'text-amber-400' : 'text-neutral-600 group-hover:text-neutral-400'
          )}
        >
          {isDragging ? 'Invocar Ilustración' : 'Seleccionar Imagen'}
        </p>
        <p className='text-[8px] text-neutral-700 uppercase tracking-widest font-medium group-hover:text-neutral-500 transition-colors'>
          {isDragging ? 'Suelta para sellar' : 'JPG, PNG, WEBP (Máx 600kB)'}
        </p>
      </div>
    </div>
  )
}
