import CampaignCreationProvider from '@/components/campaigns/creation/CampaignCreationProvider'
import { MysticBackground } from '@/components/shared/ui/MysticBackground'

export default function CreateCampaignPage() {
  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-300 flex flex-col items-center justify-center font-serif antialiased relative overflow-hidden'>
      {/* Fondo místico estilo "Portal de Piedra" */}
      <MysticBackground />

      <div className='relative z-10 w-full animate-in fade-in zoom-in duration-1000'>
        <div className='text-center mb-16 space-y-4'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-light tracking-widest text-zinc-100 uppercase font-serif drop-shadow-md pb-2'>
            Invocar Portal
          </h1>
          <p className='text-zinc-500 max-w-lg mx-auto italic tracking-wide'>
            Escribe los pormenores de tu nueva crónica para forjar el mundo en el que vivirán tus
            héroes.
          </p>
        </div>

        <div className='relative'>
          {/* Bordes rústicos simulados para el formulario */}
          <div className='absolute -inset-y-10 left-1/2 -translate-x-1/2 w-full max-w-4xl border-y border-zinc-800/50 pointer-events-none' />
          <div className='absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-900/10 to-zinc-950/0 pointer-events-none' />

          <CampaignCreationProvider />
        </div>
      </div>
    </div>
  )
}
