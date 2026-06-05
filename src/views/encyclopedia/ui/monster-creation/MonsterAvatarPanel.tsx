'use client'

import { useImageUploader } from '@/shared/ui/image-uploader/hooks/useImageUploader'
import { RefreshCcw, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useFormContext, useWatch } from 'react-hook-form'
import { IMAGE_OVERLAY } from '../../lib/image-overlay'
import type { MonsterFormFields } from './MonsterForm'

export function MonsterAvatarPanel() {
  const t = useTranslations('Encyclopedia')
  const { setValue, control } = useFormContext<MonsterFormFields>()
  const bgImageUrl = useWatch({ control, name: 'imageUrl' }) as string | undefined

  const {
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleUpload,
    handleReset,
    preview,
    isUploading,
    isSuccess,
  } = useImageUploader({
    storagePath: 'monsters',
    onUpload: (url) => setValue('imageUrl', url || undefined),
  })

  const previewSrc = bgImageUrl ?? preview

  return (
    <div className='relative h-[50vw] min-h-64 shrink-0 overflow-hidden lg:min-w-[60%] lg:flex-1 lg:h-full'>
      <Image
        src='/bg_biblioteca.png'
        alt=''
        fill
        sizes='(max-width: 1024px) 100vw, 60vw'
        className='object-cover object-top'
        priority
      />
      <div className='absolute inset-0 bg-black/60' />

      {previewSrc && (
        <div
          className='absolute w-full max-w-sm'
          style={{
            position: 'absolute',
            top: `calc(${IMAGE_OVERLAY.bottomFromTop} - ${IMAGE_OVERLAY.height})`,
            height: IMAGE_OVERLAY.height,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className='absolute -inset-4 rounded-full bg-amber-500/10 blur-2xl' />
          <div className='relative h-full w-full'>
            <Image
              src={previewSrc}
              alt='preview'
              fill
              className='object-contain transition-all duration-500'
              unoptimized
            />
          </div>
        </div>
      )}

      <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 pt-10'>
        <div className='flex gap-2'>
          {!isSuccess ? (
            <>
              <button
                type='button'
                onClick={handleClick}
                className='flex flex-1 items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-amber-600/50 hover:text-amber-400'
              >
                <Upload className='size-3.5' />
                {t('monsterForm.imageAvatar')}
              </button>
              {preview && (
                <button
                  type='button'
                  onClick={handleUpload}
                  disabled={isUploading}
                  className='flex flex-1 items-center justify-center gap-2 rounded-md bg-amber-700/70 px-3 py-2 text-xs text-amber-200 transition-colors hover:bg-amber-600/70 disabled:opacity-50'
                >
                  <Upload className='size-3.5' />
                  {isUploading ? '...' : 'Subir'}
                </button>
              )}
            </>
          ) : (
            <button
              type='button'
              onClick={handleReset}
              className='flex flex-1 items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900/70 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-red-600/50 hover:text-red-400'
            >
              <RefreshCcw className='size-3.5' />
              Cambiar imagen
            </button>
          )}
        </div>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept='image/*'
          className='hidden'
        />
      </div>
    </div>
  )
}
