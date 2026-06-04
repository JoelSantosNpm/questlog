import { darkTheme } from '@/shared/config/clerk-theme'
import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questlog | Iniciar sesión',
  description: 'Accede a tu cuenta de Questlog.',
}

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn appearance={darkTheme} />
    </div>
  )
}
