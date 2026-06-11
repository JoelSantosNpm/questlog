'use client'

import { useFileDrop } from '@/shared/lib/useFileDrop'
import { cn } from '@/shared/utils/styles'
import { useTranslations } from 'next-intl'
import { useImageUploader } from './hooks/useImageUploader'
import { UploaderActions } from './parts/UploaderActions'
import { UploaderEmptyState } from './parts/UploaderEmptyState'
import { UploaderLabel } from './parts/UploaderLabel'
import { UploaderPreview } from './parts/UploaderPreview'

type StoragePath =
  | 'assets'
  | 'profile'
  | 'characters'
  | 'monsters'
  | 'items'
  | `campaigns/${string}`
  | `characters/${string}`
  | `monsters/${string}`
  | `items/${string}`

interface ImageUploaderProps {
  onUpload: (url: string) => void
  /** Segmento de ruta dentro de la carpeta del usuario.
   *  La ruta final en Storage será: {clerkId}/{storagePath}/{timestamp}-{file} */
  storagePath?: StoragePath
  label?: string
  className?: string
}

export default function ImageUploader({
  onUpload,
  storagePath = 'assets',
  label,
  className,
}: ImageUploaderProps) {
  const t = useTranslations('Common')

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
    processFile,
  } = useImageUploader({ onUpload, storagePath })

  const { isDragging, handleDrag, handleDrop } = useFileDrop({
    onDropFile: processFile,
    disabled: isUploading || isSuccess,
  })

  return (
    <div className={cn('space-y-3', className)}>
      {label && <UploaderLabel label={label} />}

      <div className='relative group'>
        <button
          type='button'
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          tabIndex={preview ? -1 : 0}
          className={cn(
            'relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-900/40',
            preview
              ? 'border-amber-900/30 bg-neutral-900/10'
              : 'border-neutral-800 hover:border-amber-900/60 bg-neutral-950/50 cursor-pointer',
            isDragging && 'border-amber-500 bg-amber-950/20 scale-[0.99]',
            isSuccess &&
              'border-emerald-900/50 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          )}
        >
          {preview ? (
            <UploaderPreview src={preview} isUploading={isUploading} isSuccess={isSuccess} />
          ) : (
            <UploaderEmptyState isDragging={isDragging} />
          )}
        </button>

        <UploaderActions
          preview={preview}
          isUploading={isUploading}
          isSuccess={isSuccess}
          onReset={handleReset}
          onUpload={() => void handleUpload()}
        />
      </div>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        aria-label={t('imageUploader.selectImage')}
        className='hidden'
      />
    </div>
  )
}
