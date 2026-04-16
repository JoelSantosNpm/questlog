import { cn } from '@/shared/utils/styles'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface UploaderPreviewProps {
  src: string
  isUploading: boolean
  isSuccess: boolean
}

export function UploaderPreview({ src, isUploading, isSuccess }: UploaderPreviewProps) {
  return (
    <>
      <Image
        src={src}
        alt='Vista previa'
        fill
        sizes='(max-width: 768px) 100vw, 50vw'
        className={cn(
          'object-contain transition-all duration-700',
          isUploading ? 'scale-110 blur-sm' : 'scale-100'
        )}
      />
      {isUploading && (
        <div className='absolute inset-0 bg-neutral-950/60 flex flex-col items-center justify-center space-y-3 backdrop-blur-sm'>
          <Loader2 className='w-8 h-8 text-amber-500 animate-spin' />
          <p className='text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] animate-pulse'>
            Sellando...
          </p>
        </div>
      )}
      {isSuccess && (
        <div className='absolute inset-0 bg-emerald-950/40 flex flex-col items-center justify-center backdrop-blur-[2px] animate-in fade-in duration-500'>
          <p className='text-[10px] font-bold text-emerald-400 uppercase tracking-widest'>
            Imagen Sellada
          </p>
        </div>
      )}
    </>
  )
}
