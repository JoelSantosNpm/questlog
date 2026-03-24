'use client'

import { MedievalSharp } from 'next/font/google'
import { MysticBackground } from '@/components/shared/ui/MysticBackground'
import { cn } from '@/shared/utils/styles'

const medieval = MedievalSharp({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-medieval',
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang='es' className='dark'>
      <body
        className={cn(medieval.variable, 'bg-neutral-950 font-sans text-neutral-100 antialiased')}
      >
        <main className='relative flex min-h-screen flex-col items-center justify-center p-6 text-center overflow-hidden'>
          <MysticBackground />

          <div className='z-10 max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
            <div className='relative'>
              <div className='absolute inset-0 blur-3xl bg-red-900/20 rounded-full animate-pulse' />
              <h1 className='relative font-medieval text-5xl md:text-6xl text-amber-600 drop-shadow-[0_0_15px_rgba(217,119,6,0.3)]'>
                ¡Has caído en una trampa!
              </h1>
            </div>

            <div className='space-y-4'>
              <p className='text-sm uppercase tracking-[0.4em] font-bold text-neutral-500'>
                Error Crítico de Invocación
              </p>
              <div className='p-6 bg-neutral-900/40 border border-neutral-800 rounded-lg backdrop-blur-xl'>
                <p className='text-neutral-300 font-medium italic'>
                  {error.message || 'Una fuerza oscura ha interrumpido tu crónica.'}
                </p>
                {error.digest && (
                  <p className='mt-4 text-[10px] text-neutral-600 font-mono tracking-tighter'>
                    Sello del error: {error.digest}
                  </p>
                )}
              </div>
            </div>

            <div className='pt-6'>
              <button
                onClick={() => reset()}
                className='group relative px-8 py-3 bg-neutral-900 border border-amber-900/50 rounded text-xs font-bold uppercase tracking-[0.3em] text-amber-500 hover:text-white hover:bg-amber-900/20 transition-all duration-500'
              >
                <span className='relative z-10'>Conjurar de nuevo (Reset)</span>
                <div className='absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md' />
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
