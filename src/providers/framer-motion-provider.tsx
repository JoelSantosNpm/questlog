'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import type React from 'react'

export function FramerMotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
