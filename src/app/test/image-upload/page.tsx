'use client'

import { useState } from 'react'
import { ImageUploader, MysticBackground } from '@/components/shared/ui'

export default function ImageUploadTestPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  return (
    <main className='relative min-h-screen flex items-center justify-center p-4'>
      <MysticBackground />

      <div className='z-10 w-full max-w-md p-8 rounded-xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold tracking-[0.2em] uppercase text-amber-600'>
            Forja de Imágenes
          </h1>
          <p className='text-xs text-neutral-500 uppercase tracking-widest'>
            Prueba de infraestructura de Storage
          </p>
        </div>

        <div className='space-y-6'>
          <ImageUploader label='Imagen de Campaña' onUpload={(url) => setUploadedUrl(url)} />

          {uploadedUrl && (
            <div className='pt-4 border-t border-neutral-800 space-y-3'>
              <p className='text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center'>
                Resultado de la Invocación
              </p>
              <div className='p-3 bg-neutral-950 rounded border border-amber-900/20 break-all'>
                <code className='text-[10px] text-amber-700/80Selection:'>{uploadedUrl}</code>
              </div>
              <a
                href={uploadedUrl}
                target='_blank'
                rel='noreferrer'
                className='block text-center text-[10px] font-bold text-amber-600 hover:text-amber-500 uppercase tracking-widest transition-colors'
              >
                Abrir en nueva pestaña →
              </a>
            </div>
          )}
        </div>

        <div className='pt-4 text-center'>
          <p className='text-[9px] text-neutral-600 uppercase tracking-tighter'>
            Las imágenes se guardan en el bucket{' '}
            <span className='text-neutral-500'>questlog-assets</span>
          </p>
        </div>
      </div>
    </main>
  )
}
