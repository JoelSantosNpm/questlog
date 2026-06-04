'use client'

import { SignInButton } from '@clerk/nextjs'

type SignInNavButtonProps = {
  label: string
}

export function SignInNavButton({ label }: SignInNavButtonProps) {
  return (
    <SignInButton mode='modal'>
      <button
        type='button'
        className='cursor-pointer rounded px-4 py-2 font-bold text-amber-500 transition-colors hover:bg-neutral-800'
      >
        {label}
      </button>
    </SignInButton>
  )
}
