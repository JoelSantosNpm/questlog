'use client'

import { deleteAssetSafe } from '@/shared/api/storage-actions'
import { useNotifyAuthRequired } from '@/shared/lib/useNotifyAuthRequired'
import { ToggleButton } from '@/shared/ui'
import { useAuth } from '@clerk/nextjs'
import { MonsterTemplate } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { sileo } from 'sileo'
import { useCreateMonster, useUpdateMonster } from '../../api/encyclopedia-mutations'
import { MAIN_STATS, SMALL_STATS } from '../../lib/stats'
import { useSetIsCreatingNew, useSetSelectedItemId } from '../../model/encyclopediaStore'
import { MonsterAvatarPanel } from './MonsterAvatarPanel'
import { DEFAULT_MONSTER_FORM_VALUES, type MonsterFormFields } from './monster-form-fields'
import { MonsterPortraitUploader } from './MonsterPortraitUploader'
import { StatBoxWithControls } from './StatBoxWithControls'

interface MonsterFormProps {
  mode?: 'create' | 'edit'
  initialData?: MonsterTemplate
  onSuccess?: () => void
  onRegisterCleanup?: (cleanup: () => Promise<void>) => void
}

export function MonsterForm({ mode = 'create', initialData, onSuccess, onRegisterCleanup }: MonsterFormProps) {
  const t = useTranslations('Encyclopedia')
  const { userId } = useAuth()
  const notifyAuthRequired = useNotifyAuthRequired()
  const { mutateAsync: createMonsterAsync } = useCreateMonster()
  const { mutateAsync: updateMonsterAsync } = useUpdateMonster()
  const setSelectedItemId = useSetSelectedItemId()
  const setIsCreatingNew = useSetIsCreatingNew()
  const pendingUrls = useRef<Set<string>>(new Set())

  const methods = useForm<MonsterFormFields>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          race: initialData.race,
          characterClass: initialData.characterClass,
          description: initialData.description,
          imageUrl: initialData.imageUrl,
          portraitImageUrl: initialData.portraitImageUrl,
          isPublic: initialData.isPublic,
          maxHp: initialData.maxHp,
          challenge: initialData.challenge,
          ac: initialData.ac,
          speed: initialData.speed,
          strength: initialData.strength,
          dexterity: initialData.dexterity,
          constitution: initialData.constitution,
          intelligence: initialData.intelligence,
          wisdom: initialData.wisdom,
          charisma: initialData.charisma,
          initiativeBonus: initialData.initiativeBonus,
          perception: initialData.perception,
        }
      : DEFAULT_MONSTER_FORM_VALUES,
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

  const handlePortraitUpload = (url: string) => {
    const prevUrl = methods.getValues('portraitImageUrl')
    if (!url && prevUrl && pendingUrls.current.has(prevUrl)) {
      void deleteAssetSafe(prevUrl)
      pendingUrls.current.delete(prevUrl)
    }
    if (url) pendingUrls.current.add(url)
    setValue('portraitImageUrl', url || undefined)
  }

  const onSubmit = async (data: MonsterFormFields) => {
    if (!userId) {
      notifyAuthRequired()
      return
    }
    const isEdit = mode === 'edit'
    try {
      const result = isEdit
        ? await updateMonsterAsync([initialData!.id, data])
        : await createMonsterAsync(data)

      if (!result.success || !result.data) {
        sileo.error({
          title: t('monsterForm.toastErrorTitle'),
          description: t(isEdit ? 'monsterForm.toastUpdateErrorDesc' : 'monsterForm.toastErrorDesc'),
        })
        return
      }
      pendingUrls.current.clear()
      setSelectedItemId(result.data.id)
      setIsCreatingNew(false)
      sileo.success({
        title: t(isEdit ? 'monsterForm.toastUpdateSuccessTitle' : 'monsterForm.toastSuccessTitle'),
        description: t(isEdit ? 'monsterForm.toastUpdateSuccessDesc' : 'monsterForm.toastSuccessDesc'),
      })
      onSuccess?.()
    } catch {
      sileo.error({
        title: t('monsterForm.toastErrorTitle'),
        description: t(isEdit ? 'monsterForm.toastUpdateErrorDesc' : 'monsterForm.toastErrorDesc'),
      })
    }
  }

  // eslint-disable-next-line react-hooks/refs -- handleSubmit (RHF) nunca invoca onSubmit durante el render; solo lo registra como event handler
  const formSubmitHandler = handleSubmit(onSubmit)

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={formSubmitHandler}
        className='flex h-full flex-col overflow-y-auto scrollbar-encyclopedia lg:flex-row lg:overflow-visible'
      >
        <MonsterAvatarPanel onUpload={handleAvatarUpload} />

        <div className='w-full space-y-6 border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-l lg:border-t-0 lg:overflow-y-auto lg:p-6 scrollbar-encyclopedia'>
          {/* Nombre + retrato */}
          <header>
            <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
              <MonsterPortraitUploader onUpload={handlePortraitUpload} />
              <input
                {...register('name', { required: true })}
                placeholder={t('monsterForm.namePlaceholder')}
                className='min-w-0 w-full border-b border-neutral-700 bg-transparent pb-1 text-2xl font-bold text-neutral-100 focus:border-amber-500/50 focus:outline-none font-medieval'
              />
            </div>
          </header>

          {/* Descripción */}
          <textarea
            {...register('description')}
            placeholder={t('monsterForm.descriptionPlaceholder')}
            rows={3}
            className='input-encyclopedia w-full resize-none'
          />

          {/* Estadísticas */}
          <section>
            <h3 className='section-label mb-3'>{t('monsterForm.sectionStats')}</h3>
            <div className='flex justify-around'>
              {MAIN_STATS.map((stat) => (
                <StatBoxWithControls
                  key={stat.key}
                  fieldKey={stat.key as keyof MonsterFormFields}
                  label={stat.label}
                  title={stat.title}
                  boxSize='md'
                />
              ))}
              <StatBoxWithControls
                fieldKey='maxHp'
                label={t('combatStats.properties.hitPointsAbbr')}
                title={t('combatStats.properties.hitPoints')}
                boxSize='md'
                min={1}
                required
              />
            </div>
          </section>

          {/* Atributos */}
          <section>
            <h3 className='section-label mb-3'>{t('monsterForm.sectionAttributes')}</h3>
            <div className='space-y-1'>
              {SMALL_STATS.map((row, rowIndex) => (
                <div key={rowIndex} className='flex justify-center gap-2 sm:gap-5'>
                  {row.map((stat) => (
                    <StatBoxWithControls
                      key={stat.key}
                      fieldKey={stat.key as keyof MonsterFormFields}
                      label={stat.label}
                      title={stat.title}
                      boxSize='sm'
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Info tiles — mismo grid que CombatStats */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='rounded-lg border border-amber-800/30 bg-amber-950/20 p-3'>
              <span className='text-[10px] font-bold uppercase text-amber-600/70'>
                {t('combatStats.properties.challenge')}
              </span>
              <input
                {...register('challenge', { valueAsNumber: true, min: 0 })}
                type='number'
                className='mt-1 block w-full bg-transparent font-mono font-bold text-amber-400 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              />
            </div>
            <div className='info-tile'>
              <span className='text-[10px] font-bold uppercase text-neutral-500'>
                {t('combatStats.properties.type')}
              </span>
              <input
                {...register('type', { required: true })}
                placeholder={t('monsterForm.typePlaceholder')}
                className='mt-1 block w-full bg-transparent font-medium capitalize text-neutral-200 focus:outline-none'
              />
            </div>
            <div className='info-tile'>
              <span className='text-[10px] font-bold uppercase text-neutral-500'>
                {t('combatStats.properties.race')}
              </span>
              <input
                {...register('race')}
                placeholder={t('monsterForm.racePlaceholder')}
                className='mt-1 block w-full bg-transparent font-medium capitalize text-neutral-200 focus:outline-none'
              />
            </div>
            <div className='info-tile'>
              <span className='text-[10px] font-bold uppercase text-neutral-500'>
                {t('combatStats.properties.class')}
              </span>
              <input
                {...register('characterClass')}
                placeholder={t('monsterForm.classPlaceholder')}
                className='mt-1 block w-full bg-transparent font-medium capitalize text-neutral-200 focus:outline-none'
              />
            </div>
          </div>

          {/* Público + submit */}
          <div className='flex items-center gap-3'>
            <ToggleButton
              label={t('monsterForm.publicLabel')}
              isActive={isPublic}
              onToggle={() => setValue('isPublic', !isPublic)}
            />
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 rounded-md bg-amber-600/80 py-2.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-amber-500 disabled:opacity-50'
            >
              {mode === 'create' ? t('monsterForm.submitCreate') : t('monsterForm.submitEdit')}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
