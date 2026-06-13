'use client'

import { SignInButton } from '@clerk/nextjs'
import { CircleUserRound } from 'lucide-react'

type SignInNavButtonProps = {
  label: string
}

export function SignInNavButton({ label }: SignInNavButtonProps) {
  return (
    <SignInButton mode='modal'>
      <button
        type='button'
        className='group flex cursor-pointer items-center gap-2 rounded px-4 py-2 font-bold text-amber-500 transition-colors hover:bg-neutral-800'
      >
        <CircleUserRound className='size-5 transition-transform group-hover:scale-110' />
        <span className='hidden sm:block'>{label}</span>
      </button>
    </SignInButton>
  )
}
