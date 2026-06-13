'use client'

import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { sileo } from 'sileo'
import {
  useDeleteCharacterTemplate,
  useDeleteItemTemplate,
  useDeleteMonster,
} from '../api/encyclopedia-mutations'
import type { EncyclopediaItem } from '../model/encyclopedia-item'
import { useActiveSection, useSetIsEditing, useSetSelectedItemId } from '../model/encyclopediaStore'

export const ItemActionsOverlay = ({ item }: { item: EncyclopediaItem }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const activeSection = useActiveSection()
  const setIsEditing = useSetIsEditing()
  const setSelectedItemId = useSetSelectedItemId()
  const t = useTranslations('Encyclopedia.detailView')

  const { mutateAsync: deleteMonsterAsync } = useDeleteMonster()
  const { mutateAsync: deleteCharacterAsync } = useDeleteCharacterTemplate()
  const { mutateAsync: deleteItemAsync } = useDeleteItemTemplate()

  if (!item.isOwner) return null

  const handleDelete = async () => {
    let result
    try {
      result =
        activeSection === 'bestiary'
          ? await deleteMonsterAsync(item.id)
          : activeSection === 'cast'
            ? await deleteCharacterAsync(item.id)
            : await deleteItemAsync(item.id)
    } catch {
      setConfirmingDelete(false)
      sileo.error({ title: t('toastDeleteErrorTitle'), description: t('toastDeleteErrorDesc') })
      return
    }

    if (!result.success) {
      setConfirmingDelete(false)
      sileo.error({ title: t('toastDeleteErrorTitle'), description: t('toastDeleteErrorDesc') })
      return
    }

    setSelectedItemId(null)
    sileo.success({ title: t('toastDeleteSuccessTitle'), description: t('toastDeleteSuccessDesc') })
  }

  return (
    <div className='absolute right-4 top-4 z-20 flex items-center gap-2'>
      {confirmingDelete ? (
        <>
          <button
            type='button'
            onClick={() => setConfirmingDelete(false)}
            className='flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-200'
          >
            <X className='size-3.5' />
            {t('cancelButton')}
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='flex items-center gap-1 rounded-md border border-red-700/40 bg-red-950/50 px-2 py-1 text-xs font-medium text-red-400 backdrop-blur-sm transition-colors hover:bg-red-900/50'
          >
            <Check className='size-3.5' />
            {t('confirmDeleteButton')}
          </button>
        </>
      ) : (
        <>
          <button
            type='button'
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-neutral-200'
          >
            <Pencil className='size-3.5' />
            {t('editButton')}
          </button>
          <button
            type='button'
            onClick={() => setConfirmingDelete(true)}
            className='flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-xs text-neutral-400 backdrop-blur-sm transition-colors hover:text-red-400'
          >
            <Trash2 className='size-3.5' />
            {t('deleteButton')}
          </button>
        </>
      )}
    </div>
  )
}
