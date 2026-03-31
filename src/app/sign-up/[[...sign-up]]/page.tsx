import { SignUp } from '@clerk/nextjs'
import { darkTheme } from '@/shared/config/clerk-theme'

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignUp appearance={darkTheme} />
    </div>
  )
}
