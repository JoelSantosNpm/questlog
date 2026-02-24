import { AUTH_ROUTES } from '@/config/routes/auth'
import { cn } from '@/shared/utils/styles'
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter, MedievalSharp } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const medieval = MedievalSharp({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-medieval',
})

export const metadata: Metadata = {
  title: 'Questlog | Dungeon Master Toolkit',
  description: 'Gestiona tus campañas de D&D con el poder de la piedra y el acero.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      signInUrl={AUTH_ROUTES.signIn}
      signUpUrl={AUTH_ROUTES.signUp}
      afterSignOutUrl={AUTH_ROUTES.signIn}
      signInFallbackRedirectUrl={AUTH_ROUTES.afterSignIn}
      signUpFallbackRedirectUrl={AUTH_ROUTES.afterSignUp}
    >
      <html lang='es' className='dark h-full'>
        <body
          className={cn(
            inter.className,
            medieval.variable,
            'flex min-h-screen flex-col bg-neutral-950 font-sans text-neutral-100 antialiased selection:bg-amber-500/30'
          )}
        >
          {/* Fondo Ambiental (Grimdark) */}
          <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-80' />

          {/* Header Sticky */}
          <header className='sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md'>
            <div className='flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center gap-2'>
                <h1 className='font-medieval text-2xl tracking-wide text-amber-500/90 drop-shadow-sm transition-colors hover:text-amber-400'>
                  Questlog
                </h1>
              </div>
              <div className='flex items-center gap-4'>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='rounded px-4 py-2 font-bold text-amber-500 hover:bg-neutral-800 transition-colors'>
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
          <main className='w-full flex-1'>{children}</main>

          {/* Footer */}
          <footer className='border-t border-neutral-800/30 bg-neutral-950/50 py-6 text-center text-xs text-neutral-500'>
            <p>&copy; {new Date().getFullYear()} Questlog System. v0.1.0-alpha</p>
            <p className='mt-1 font-medieval text-neutral-600'>
              Forjando leyendas en la oscuridad.
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
