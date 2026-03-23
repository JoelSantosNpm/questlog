import { MouseEvent } from 'react'
import { X, CloudUpload } from 'lucide-react'

interface UploaderActionsProps {
  preview: string | null
  isUploading: boolean
  isSuccess: boolean
  onReset: (e: MouseEvent) => void
  onUpload: () => void
}

export function UploaderActions({ preview, isUploading, isSuccess, onReset, onUpload }: UploaderActionsProps) {
  if (!preview || isUploading) return null

  if (isSuccess) {
    return (
      <button
        type='button'
        onClick={onReset}
        className='absolute top-2 right-2 p-1.5 bg-neutral-950/80 border border-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all shadow-xl z-10'
      >
        <X className='w-3.5 h-3.5' />
      </button>
    )
  }

  return (
    <div className='absolute bottom-3 right-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2'>
      <button
        type='button'
        onClick={onReset}
        className='px-3 py-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded text-[10px] font-bold text-neutral-400 hover:text-red-400 hover:border-red-900/30 transition-all uppercase tracking-wider'
      >
        <X className='inline w-3 h-3 mr-1.5' /> Descartar
      </button>
      <button
        type='button'
        onClick={onUpload}
        className='px-3 py-1.5 bg-amber-700 border border-amber-600 rounded text-[10px] font-bold text-white hover:bg-amber-600 transition-all uppercase tracking-widest shadow-lg shadow-amber-900/20'
      >
        <CloudUpload className='inline w-3 h-3 mr-1.5' /> Confirmar
      </button>
    </div>
  )
}
