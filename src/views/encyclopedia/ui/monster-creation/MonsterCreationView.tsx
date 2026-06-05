'use client'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSetIsCreatingNew } from '../../model/encyclopediaStore'
import { MonsterForm } from './MonsterForm'

export function MonsterCreationView() {
  const setIsCreatingNew = useSetIsCreatingNew()
  const t = useTranslations('Encyclopedia')

  return (
    <main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent">
      <div className="absolute left-4 top-4 z-10">
        <button
          onClick={() => setIsCreatingNew(false)}
          className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-200"
        >
          <ArrowLeft className="size-3.5" />
          {t('monsterForm.backButton')}
        </button>
      </div>
      <MonsterForm onSuccess={() => setIsCreatingNew(false)} />
    </main>
  )
}
