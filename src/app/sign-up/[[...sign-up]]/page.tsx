import { darkTheme } from '@/shared/config/clerk-theme'
import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questlog | Crear cuenta',
  description: 'Únete a Questlog y gestiona tus campañas de rol.',
}

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignUp appearance={darkTheme} />
    </div>
  )
}
