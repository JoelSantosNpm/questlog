'use client'

import { useAuth } from '@clerk/nextjs'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { sileo } from 'sileo'
import { useSetIsCreatingNew } from '../../model/encyclopediaStore'
import { MonsterForm } from './MonsterForm'

export function MonsterCreationView() {
  const setIsCreatingNew = useSetIsCreatingNew()
  const { isLoaded, userId } = useAuth()
  const t = useTranslations('Encyclopedia')

  useEffect(() => {
    if (!isLoaded || userId) return
    sileo.warning({
      title: t('monsterForm.guestNoticeTitle'),
      description: t('monsterForm.guestNoticeDesc'),
    })
  }, [isLoaded, userId, t])

  return (
    <main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-3">
        <button
          onClick={() => setIsCreatingNew(false)}
          className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-200"
        >
          <ArrowLeft className="size-3.5" />
          {t('monsterForm.backButton')}
        </button>
        <span className="flex items-center gap-1.5 rounded-full border border-amber-700/40 bg-amber-950/50 px-3 py-1 text-xs font-medium text-amber-400 backdrop-blur-sm">
          <Sparkles className="size-3.5" />
          {t('monsterForm.creatingIndicator')}
        </span>
      </div>
      <MonsterForm onSuccess={() => setIsCreatingNew(false)} />
    </main>
  )
}
