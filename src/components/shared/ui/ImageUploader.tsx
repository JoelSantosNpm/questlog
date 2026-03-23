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
    <div className='relative flex flex-col items-center justify-center p-6 space-y-4 text-center w-full h-full'>
      {/* Esquinas decorativas estilo marco de dibujo */}
      <div className={cn(
        "absolute top-4 left-4 w-3 h-3 border-t border-l border-neutral-800/60 transition-all duration-500",
        isDragging ? "top-2 left-2 border-amber-700" : "group-hover:top-3 group-hover:left-3 group-hover:border-neutral-700"
      )} />
      <div className={cn(
        "absolute top-4 right-4 w-3 h-3 border-t border-r border-neutral-800/60 transition-all duration-500",
        isDragging ? "top-2 right-2 border-amber-700" : "group-hover:top-3 group-hover:right-3 group-hover:border-neutral-700"
      )} />
      <div className={cn(
        "absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neutral-800/60 transition-all duration-500",
        isDragging ? "bottom-2 left-2 border-amber-700" : "group-hover:bottom-3 group-hover:left-3 group-hover:border-neutral-700"
      )} />
      <div className={cn(
        "absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neutral-800/60 transition-all duration-500",
        isDragging ? "bottom-2 right-2 border-amber-700" : "group-hover:bottom-3 group-hover:right-3 group-hover:border-neutral-700"
      )} />

      <div className={cn(
        'relative p-4 bg-neutral-900/40 rounded-full border border-neutral-800 group-hover:border-amber-900/40 transition-all duration-500 shadow-xl',
        isDragging && "scale-110 bg-amber-950/20 border-amber-700"
      )}>
        <Upload className={cn(
          "w-6 h-6 transition-colors duration-500",
          isDragging ? "text-amber-500" : "text-neutral-700 group-hover:text-amber-700"
        )} />
      </div>

      <div className='relative space-y-1.5'>
        <p className={cn(
          'text-[10px] font-bold transition-colors duration-500 uppercase tracking-[0.3em]',
          isDragging ? 'text-amber-400' : 'text-neutral-600 group-hover:text-neutral-400'
        )}>
          {isDragging ? 'Invocar Ilustración' : 'Seleccionar Imagen'}
        </p>
        <p className='text-[8px] text-neutral-700 uppercase tracking-widest font-medium group-hover:text-neutral-500 transition-colors'>
          {isDragging ? 'Suelta para sellar' : 'JPG, PNG, WEBP (Máx 2MB)'}
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
