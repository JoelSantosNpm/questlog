import Link from 'next/link'
import { MysticBackground } from '@/components/shared/ui/MysticBackground'

export default function NotFound() {
  return (
    <main className='relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center overflow-hidden'>
      <MysticBackground />

      <div className='z-10 max-w-lg space-y-8 animate-in fade-in zoom-in duration-1000'>
        <div className='relative'>
          <span className='absolute inset-0 blur-2xl bg-amber-900/10 rounded-full' />
          <h1 className='relative font-medieval text-7xl md:text-8xl text-amber-600/90'>404</h1>
          <h2 className='font-medieval text-3xl md:text-4xl text-neutral-300 tracking-wide mt-2'>
            Has perdido el camino
          </h2>
        </div>

        <p className='text-sm uppercase tracking-[0.4em] font-medium text-neutral-500 leading-relaxed max-w-sm mx-auto'>
          La ruta que has intentado seguir no figura en nuestros pergaminos.
        </p>

        <div className='pt-8'>
          <Link
            href='/dashboard'
            className='inline-flex items-center px-8 py-3 bg-amber-700/10 border border-amber-900/40 rounded text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 hover:text-white hover:bg-amber-800/20 hover:border-amber-700/60 transition-all duration-500'
          >
            Regresar al Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
