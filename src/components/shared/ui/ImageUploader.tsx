'use client'

import { useFileDrop } from '@/hooks/ui/useFileDrop'
import { cn } from '@/shared/utils/styles'
import { CloudUpload, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useImageUploader } from './hooks/useImageUploader'
import { MouseEvent } from 'react'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  category?: 'campaigns' | 'monsters' | 'characters' | 'items' | 'assets'
  label?: string
  className?: string
}

export default function ImageUploader({ 
  onUpload, 
  category = 'assets', 
  label, 
  className 
}: ImageUploaderProps) {
  
  const {
    preview,
    isUploading,
    isSuccess,
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleKeyDown,
    handleUpload,
    handleReset,
    processFile
  } = useImageUploader({ onUpload, category })

  const { isDragging, handleDrag, handleDrop } = useFileDrop({
    onDropFile: processFile,
    disabled: isUploading || isSuccess
  })

  return (
    <div className={cn('space-y-3', className)}>
      {label && <UploaderLabel label={label} />}

      <div className='relative group'>
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={preview ? -1 : 0}
          className={cn(
            'relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-900/40',
            preview 
              ? 'border-amber-900/30 bg-neutral-900/10' 
              : 'border-neutral-800 hover:border-amber-900/60 bg-neutral-950/50 cursor-pointer',
            isDragging && 'border-amber-500 bg-amber-950/20 scale-[0.99]',
            isSuccess && 'border-emerald-900/50 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          )}
        >
          {preview ? (
            <UploaderPreview 
              src={preview} 
              isUploading={isUploading} 
              isSuccess={isSuccess} 
            />
          ) : (
            <UploaderEmptyState isDragging={isDragging} />
          )}
        </div>

        <UploaderActions 
          preview={preview} 
          isUploading={isUploading} 
          isSuccess={isSuccess} 
          onReset={handleReset} 
          onUpload={handleUpload} 
        />
      </div>

      <input type='file' ref={fileInputRef} onChange={handleFileSelect} accept='image/*' className='hidden' />
    </div>
  )
}

// --- SUB-COMPONENTES ATÓMICOS ---

function UploaderLabel({ label }: { label: string }) {
  return (
    <label className='text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500'>
      {label}
    </label>
  )
}

function UploaderPreview({ src, isUploading, isSuccess }: { src: string, isUploading: boolean, isSuccess: boolean }) {
  return (
    <>
      <Image
        src={src}
        alt='Vista previa'
        fill
        className={cn(
          'object-cover transition-all duration-700',
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
          <p className='text-[10px] font-bold text-emerald-400 uppercase tracking-widest'>Imagen Sellada</p>
        </div>
      )}
    </>
  )
}

function UploaderEmptyState({ isDragging }: { isDragging: boolean }) {
  return (
    <div className='flex flex-col items-center justify-center p-6 space-y-3'>
      <div className='p-3 bg-neutral-900/80 rounded-full border border-neutral-800 group-hover:border-amber-900/50 transition-colors'>
        <Upload className={cn(
          "w-5 h-5 transition-colors",
          isDragging ? "text-amber-500" : "text-neutral-600 group-hover:text-amber-600"
        )} />
      </div>
      <div className='text-center'>
        <p className='text-xs font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase tracking-widest'>
          {isDragging ? 'Suelta para invocar' : 'Seleccionar Imagen'}
        </p>
      </div>
    </div>
  )
}

interface UploaderActionsProps {
  preview: string | null
  isUploading: boolean
  isSuccess: boolean
  onReset: (e: MouseEvent) => void
  onUpload: () => void
}

function UploaderActions({ preview, isUploading, isSuccess, onReset, onUpload }: UploaderActionsProps) {
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
