'use client'

import { ToggleButton } from '@/shared/ui'
import { MonsterTemplate, Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { type InputHTMLAttributes, type Ref } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { sileo } from 'sileo'
import { useCreateMonster } from '../../api/encyclopedia-mutations'
import { MAIN_STATS, SMALL_STATS, type NumericStatKey } from '../../lib/stats'
import { useSetIsCreatingNew, useSetSelectedItemId } from '../../model/encyclopediaStore'
import { MonsterAvatarPanel } from './MonsterAvatarPanel'
import { MonsterPortraitUploader } from './MonsterPortraitUploader'

export type MonsterFormFields = Pick<
  Prisma.MonsterTemplateCreateInput,
  | 'name'
  | 'type'
  | 'race'
  | 'characterClass'
  | 'description'
  | 'imageUrl'
  | 'portraitImageUrl'
  | 'isPublic'
  | 'maxHp'
  | 'challenge'
  | 'ac'
  | 'speed'
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'
  | 'initiativeBonus'
  | 'perception'
>

interface MonsterFormProps {
  mode?: 'create' | 'edit'
  initialData?: MonsterTemplate
  onSuccess?: () => void
}

const DEFAULT_VALUES: MonsterFormFields = {
  name: '',
  type: '',
  race: 'Desconocido',
  characterClass: 'Desconocido',
  isPublic: false,
  maxHp: 10,
  challenge: 1,
  ac: 10,
  speed: 30,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  initiativeBonus: 0,
  perception: 10,
}

function StatInput({
  label,
  ref,
  ...props
}: { label: string; ref?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className='flex flex-col gap-1'>
      <span className='truncate text-[10px] font-bold uppercase tracking-widest text-neutral-500'>
        {label}
      </span>
      <input
        type='number'
        ref={ref}
        {...props}
        className='input-encyclopedia w-full text-center font-mono font-bold text-neutral-200'
      />
    </label>
  )
}

export function MonsterForm({ mode = 'create', initialData, onSuccess }: MonsterFormProps) {
  const t = useTranslations('Encyclopedia')
  const createMonster = useCreateMonster()
  const setSelectedItemId = useSetSelectedItemId()
  const setIsCreatingNew = useSetIsCreatingNew()

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
      : DEFAULT_VALUES,
  })

  const { register, handleSubmit, setValue, control, formState: { isSubmitting } } = methods
  const isPublic = (useWatch({ control, name: 'isPublic' }) as boolean) ?? false

  const onSubmit = async (data: MonsterFormFields) => {
    try {
      const result = await createMonster.mutateAsync(data)
      if (!result.success || !result.data) {
        sileo.error({ title: t('monsterForm.toastErrorTitle'), description: t('monsterForm.toastErrorDesc') })
        return
      }
      setSelectedItemId(result.data.id)
      setIsCreatingNew(false)
      sileo.success({ title: t('monsterForm.toastSuccessTitle'), description: t('monsterForm.toastSuccessDesc') })
      onSuccess?.()
    } catch {
      sileo.error({ title: t('monsterForm.toastErrorTitle'), description: t('monsterForm.toastErrorDesc') })
    }
  }

  const numericField = (key: NumericStatKey) =>
    register(key as keyof MonsterFormFields, { valueAsNumber: true })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col lg:flex-row lg:h-full'>

        <MonsterAvatarPanel />

        <div className='w-full space-y-6 border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-l lg:border-t-0 lg:overflow-y-auto lg:p-6 scrollbar-encyclopedia'>

          <header>
            <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
              <MonsterPortraitUploader />
              <input
                {...register('name', { required: true })}
                placeholder={t('monsterForm.namePlaceholder')}
                className='min-w-0 w-full border-b border-neutral-700 bg-transparent pb-1 text-2xl font-bold text-neutral-100 focus:border-amber-500/50 focus:outline-none font-medieval'
              />
            </div>
          </header>

          <div className='grid grid-cols-2 gap-3'>
            <input {...register('type', { required: true })} placeholder={t('monsterForm.typePlaceholder')} className='input-encyclopedia' />
            <input {...register('race')} placeholder={t('monsterForm.racePlaceholder')} className='input-encyclopedia' />
            <input {...register('characterClass')} placeholder={t('monsterForm.classPlaceholder')} className='input-encyclopedia' />
            <ToggleButton
              label={t('monsterForm.publicLabel')}
              isActive={isPublic}
              onToggle={() => setValue('isPublic', !isPublic)}
            />
          </div>

          <textarea
            {...register('description')}
            placeholder={t('monsterForm.descriptionPlaceholder')}
            rows={3}
            className='input-encyclopedia w-full resize-none'
          />

          <section>
            <h3 className='section-label mb-3'>{t('monsterForm.sectionStats')}</h3>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              <StatInput label={t('monsterForm.fieldMaxHp')} {...register('maxHp', { required: true, valueAsNumber: true, min: 1 })} />
              <StatInput label={t('monsterForm.fieldChallenge')} {...register('challenge', { valueAsNumber: true, min: 0 })} />
              {MAIN_STATS.map((stat) => (
                <StatInput key={stat.key} label={stat.title} {...numericField(stat.key)} />
              ))}
            </div>
          </section>

          <section>
            <h3 className='section-label mb-3'>{t('monsterForm.sectionAttributes')}</h3>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {[...SMALL_STATS[0], ...SMALL_STATS[1]].map((stat) => (
                <StatInput key={stat.key} label={stat.title} {...numericField(stat.key)} />
              ))}
            </div>
          </section>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-md bg-amber-600/80 py-2.5 text-sm font-bold text-neutral-100 transition-colors hover:bg-amber-500 disabled:opacity-50'
          >
            {mode === 'create' ? t('monsterForm.submitCreate') : t('monsterForm.submitEdit')}
          </button>

        </div>
      </form>
    </FormProvider>
  )
}
