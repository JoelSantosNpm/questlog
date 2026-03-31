import { AuthProvider } from '@/app/providers/auth-provider'
import { FramerMotionProvider } from '@/app/providers/framer-motion-provider'
import { AuthSync } from '@/app/auth'
import { cn } from '@/shared/utils/styles'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter, MedievalSharp } from 'next/font/google'
import { Toaster } from 'sileo'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const medieval = MedievalSharp({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-medieval',
})

import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Questlog | Dungeon Master Toolkit',
  description: 'Gestiona tus campañas de D&D con el poder de la piedra y el acero.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <html lang='es' className='dark h-full'>
        <body
          className={cn(
            inter.className,
            medieval.variable,
            'flex min-h-screen flex-col bg-neutral-950 font-sans text-neutral-100 antialiased selection:bg-amber-500/30'
          )}
        >
          {/* Sincronización de Usuario (Lazy Sync) */}
          <AuthSync />

          {/* Fondo Ambiental (Grimdark) */}
          <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-80' />

          {/* Header Sticky */}
          <header className='sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md'>
            <div className='flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center gap-2'>
                <Link href='/'>
                  <h1 className='font-medieval text-2xl tracking-wide text-amber-500/90 drop-shadow-sm transition-colors hover:text-amber-400'>
                    Questlog
                  </h1>
                </Link>
              </div>
              <div className='flex items-center gap-6'>
                <SignedIn>
                  <Link
                    href='/encyclopedia'
                    className='group flex items-center gap-2 text-neutral-400 transition-colors hover:text-amber-500'
                    title='Encyclopedia'
                  >
                    <BookOpen className='h-5 w-5 transition-transform group-hover:scale-110' />
                    <span className='hidden text-sm font-medium sm:block'>Enciclopedia</span>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='rounded px-4 py-2 font-bold text-amber-500 hover:bg-neutral-800 transition-colors cursor-pointer'>
                      Entrar
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className='w-full flex-1'>
            <FramerMotionProvider>{children}</FramerMotionProvider>
          </main>

          {/* Footer */}
          <footer className='border-t border-neutral-800/30 bg-neutral-950/50 py-6 text-center text-xs text-neutral-500'>
            <p>&copy; {new Date().getFullYear()} Questlog System. v0.1.0-alpha</p>
            <p className='mt-1 font-medieval text-neutral-600'>
              Forjando leyendas en la oscuridad.
            </p>
          </footer>
          <Toaster theme='light' position='top-center' />
        </body>
      </html>
    </AuthProvider>
  )
}
