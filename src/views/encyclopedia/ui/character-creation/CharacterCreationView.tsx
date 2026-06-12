'use client'

import { useAuth } from '@clerk/nextjs'
import type { CharacterTemplate } from '@prisma/client'
import { ArrowLeft, Pencil, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { sileo } from 'sileo'
import { useSelectedItem } from '../../lib/use-encyclopedia-items'
import { useIsEditing, useSetIsCreatingNew, useSetIsEditing } from '../../model/encyclopediaStore'
import { CharacterForm } from './CharacterForm'

export function CharacterCreationView() {
  const setIsCreatingNew = useSetIsCreatingNew()
  const isEditing = useIsEditing()
  const setIsEditing = useSetIsEditing()
  const selectedItem = useSelectedItem()
  const { isLoaded, userId } = useAuth()
  const t = useTranslations('Encyclopedia')
  const cleanupRef = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    if (!isLoaded || userId) return
    sileo.warning({
      title: t('characterForm.guestNoticeTitle'),
      description: t('characterForm.guestNoticeDesc'),
    })
  }, [isLoaded, userId, t])

  const handleBack = async () => {
    await cleanupRef.current?.()
    setIsCreatingNew(false)
    setIsEditing(false)
  }

  const handleSuccess = () => {
    setIsCreatingNew(false)
    setIsEditing(false)
  }

  return (
    <main className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-200"
        >
          <ArrowLeft className="size-3.5" />
          {t('characterForm.backButton')}
        </button>
        <span className="flex items-center gap-1.5 rounded-full border border-amber-700/40 bg-amber-950/50 px-3 py-1 text-xs font-medium text-amber-400 backdrop-blur-sm">
          {isEditing ? <Pencil className="size-3.5" /> : <Sparkles className="size-3.5" />}
          {isEditing ? t('characterForm.editingIndicator') : t('characterForm.creatingIndicator')}
        </span>
      </div>
      <CharacterForm
        mode={isEditing ? 'edit' : 'create'}
        initialData={isEditing ? (selectedItem as CharacterTemplate | undefined) : undefined}
        onSuccess={handleSuccess}
        onRegisterCleanup={(fn) => {
          cleanupRef.current = fn
        }}
      />
    </main>
  )
}
