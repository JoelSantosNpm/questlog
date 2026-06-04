'use client'

import { SignInNavButton } from '@/app/auth/sign-in-nav-button'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

type HeaderAuthActionsProps = {
  signInLabel: string
  dashboardLabel: string
  dashboardTitle: string
}

export function HeaderAuthActions({
  signInLabel,
  dashboardLabel,
  dashboardTitle,
}: HeaderAuthActionsProps) {
  return (
    <>
      <SignedOut>
        <SignInNavButton label={signInLabel} />
      </SignedOut>
      <SignedIn>
        <Link
          href='/dashboard'
          className='group flex items-center gap-2 text-neutral-400 transition-colors hover:text-amber-500'
          title={dashboardTitle}
        >
          <LayoutDashboard className='size-5 transition-transform group-hover:scale-110' />
          <span className='hidden text-sm font-medium sm:block'>{dashboardLabel}</span>
        </Link>
        <UserButton />
      </SignedIn>
    </>
  )
}
