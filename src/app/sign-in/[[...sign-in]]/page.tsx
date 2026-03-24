import { SignIn } from '@clerk/nextjs'
import { darkTheme } from '@/config/clerk-theme'

export default function Page() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn appearance={darkTheme} />
    </div>
  )
}
