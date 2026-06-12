'use client'

import { deleteAssetSafe } from '@/shared/api/storage-actions'
import { useNotifyAuthRequired } from '@/shared/lib/useNotifyAuthRequired'
import { ToggleButton } from '@/shared/ui'
import { useAuth } from '@clerk/nextjs'
import { ItemTemplate } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { sileo } from 'sileo'
import { useCreateItemTemplate, useUpdateItemTemplate } from '../../api/encyclopedia-mutations'
import { RARITY_LABEL_KEYS, RARITY_VALUES } from '../../lib/rarity'
import { MAIN_STATS, SMALL_STATS } from '../../lib/stats'
import { useSetIsCreatingNew, useSetSelectedItemId } from '../../model/encyclopediaStore'
import { AvatarPanel } from '../creation/AvatarPanel'
import { StatBoxWithControls } from '../creation/StatBoxWithControls'
import { DEFAULT_ITEM_FORM_VALUES, type ItemFormFields } from './item-form-fields'

interface ItemFormProps {
  mode?: 'create' | 'edit'
  initialData?: ItemTemplate
  onSuccess?: () => void
  onRegisterCleanup?: (cleanup: () => Promise<void>) => void
}

export function ItemForm({ mode = 'create', initialData, onSuccess, onRegisterCleanup }: ItemFormProps) {
  const t = useTranslations('Encyclopedia')
  const { userId } = useAuth()
  const notifyAuthRequired = useNotifyAuthRequired()
  const { mutateAsync: createItemAsync } = useCreateItemTemplate()
  const { mutateAsync: updateItemAsync } = useUpdateItemTemplate()
  const setSelectedItemId = useSetSelectedItemId()
  const setIsCreatingNew = useSetIsCreatingNew()
  const pendingUrls = useRef<Set<string>>(new Set())

  const methods = useForm<ItemFormFields>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          imageUrl: initialData.imageUrl,
          category: initialData.category,
          weight: initialData.weight,
          value: initialData.value,
          rarity: initialData.rarity,
          isPublic: initialData.isPublic,
          strength: initialData.strength,
          dexterity: initialData.dexterity,
          constitution: initialData.constitution,
          intelligence: initialData.intelligence,
          wisdom: initialData.wisdom,
          charisma: initialData.charisma,
          ac: initialData.ac,
          speed: initialData.speed,
          initiativeBonus: initialData.initiativeBonus,
          perception: initialData.perception,
        }
      : DEFAULT_ITEM_FORM_VALUES,
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods
  const isPublic = (useWatch({ control, name: 'isPublic' }) as boolean) ?? false

  useEffect(() => {
    onRegisterCleanup?.(async () => {
      await Promise.all([...pendingUrls.current].map((url) => deleteAssetSafe(url)))
      pendingUrls.current.clear()
    })
  }, [onRegisterCleanup])

  useEffect(() => {
    const urls = pendingUrls.current
    return () => {
      for (const url of urls) {
        void deleteAssetSafe(url)
      }
    }
  }, [])

  const handleAvatarUpload = (url: string) => {
    const prevUrl = methods.getValues('imageUrl')
    if (!url && prevUrl && pendingUrls.current.has(prevUrl)) {
      void deleteAssetSafe(prevUrl)
      pendingUrls.current.delete(prevUrl)
    }
    if (url) pendingUrls.current.add(url)
    setValue('imageUrl', url || undefined)
  }

  const onSubmit = async (data: ItemFormFields) => {
    if (!userId) {
      notifyAuthRequired()
      return
    }
    const isEdit = mode === 'edit'
    try {
      const result = isEdit
        ? await updateItemAsync([initialData!.id, data])
        : await createItemAsync(data)

      if (!result.success || !result.data) {
        sileo.error({
          title: t('itemForm.toastErrorTitle'),
          description: t(isEdit ? 'itemForm.toastUpdateErrorDesc' : 'itemForm.toastErrorDesc'),
        })
        return
      }
      pendingUrls.current.clear()
      setSelectedItemId(result.data.id)
      setIsCreatingNew(false)
      sileo.success({
        title: t(isEdit ? 'itemForm.toastUpdateSuccessTitle' : 'itemForm.toastSuccessTitle'),
        description: t(isEdit ? 'itemForm.toastUpdateSuccessDesc' : 'itemForm.toastSuccessDesc'),
      })
      onSuccess?.()
    } catch {
      sileo.error({
        title: t('itemForm.toastErrorTitle'),
        description: t(isEdit ? 'itemForm.toastUpdateErrorDesc' : 'itemForm.toastErrorDesc'),
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className='flex h-full flex-col overflow-y-auto scrollbar-encyclopedia lg:flex-row lg:overflow-visible'
      >
        <AvatarPanel<ItemFormFields> storagePath='items' onUpload={handleAvatarUpload} />

        <div className='w-full space-y-6 border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-l lg:border-t-0 lg:overflow-y-auto lg:p-6 scrollbar-encyclopedia'>
          {/* Nombre */}
          <header>
            <input
              {...register('name', { required: true })}
              placeholder={t('itemForm.namePlaceholder')}
              className='w-full border-b border-neutral-700 bg-transparent pb-1 text-2xl font-bold text-neutral-100 focus:border-amber-500/50 focus:outline-none font-medieval'
            />
          </header>

          {/* Descripción */}
          <textarea
            {...register('description')}
            placeholder={t('itemForm.descriptionPlaceholder')}
            rows={3}
            className='input-encyclopedia w-full resize-none'
          />

          {/* Propiedades */}
          <section>
            <h3 className='section-label mb-3'>{t('itemProperties.propertiesHeading')}</h3>
            <div className='grid grid-cols-2 gap-3'>
              <div className='info-tile'>
                <span className='text-[10px] font-bold uppercase text-neutral-500'>
                  {t('itemProperties.labels.category')}
                </span>
                <input
                  {...register('category')}
                  className='mt-1 block w-full bg-transparent font-medium capitalize text-neutral-200 focus:outline-none'
                />
              </div>
              <div className='info-tile'>
                <span className='text-[10px] font-bold uppercase text-neutral-500'>
                  {t('itemProperties.labels.rarity')}
                </span>
                <select
                  {...register('rarity')}
                  className='mt-1 block w-full bg-transparent font-medium capitalize text-neutral-200 focus:outline-none'
                >
                  {RARITY_VALUES.map((value) => (
                    <option key={value} value={value} className='bg-neutral-900'>
                      {t(`itemProperties.rarities.${RARITY_LABEL_KEYS[value]}` as Parameters<typeof t>[0])}
                    </option>
                  ))}
                </select>
              </div>
              <div className='info-tile'>
                <span className='text-[10px] font-bold uppercase text-neutral-500'>
                  {t('itemProperties.labels.value')}
                </span>
                <input
                  {...register('value', { valueAsNumber: true, min: 0 })}
                  type='number'
                  className='mt-1 block w-full bg-transparent font-mono font-bold text-amber-500 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
              <div className='info-tile'>
                <span className='text-[10px] font-bold uppercase text-neutral-500'>
                  {t('itemProperties.labels.weight')}
                </span>
                <input
                  {...register('weight', { valueAsNumber: true, min: 0 })}
                  type='number'
                  step='0.1'
                  className='mt-1 block w-full bg-transparent font-mono text-neutral-200 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>
          </section>

          {/* Modificadores */}
          <section>
            <h3 className='section-label mb-3'>{t('itemProperties.modifiersHeading')}</h3>
            <div className='space-y-1'>
              <div className='flex justify-around'>
                {MAIN_STATS.map((stat) => (
                  <StatBoxWithControls<ItemFormFields>
                    key={stat.key}
                    fieldKey={stat.key}
                    label={stat.label}
                    title={stat.title}
                    boxSize='md'
                  />
                ))}
              </div>
              {SMALL_STATS.map((row, rowIndex) => (
                <div key={rowIndex} className='flex justify-center gap-2 sm:gap-5'>
                  {row.map((stat) => (
                    <StatBoxWithControls<ItemFormFields>
                      key={stat.key}
                      fieldKey={stat.key}
                      label={stat.label}
                      title={stat.title}
                      boxSize='sm'
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Público + submit */}
          <div className='flex items-center gap-3'>
            <ToggleButton
              label={t('itemForm.publicLabel')}
              isActive={isPublic}
              onToggle={() => setValue('isPublic', !isPublic)}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 rounded-md bg-amber-600/80 py-2.5 text-sm font-bold text-neutral-100 transition-colors hover:bg-amber-500 disabled:opacity-50'
            >
              {mode === 'create' ? t('itemForm.submitCreate') : t('itemForm.submitEdit')}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
