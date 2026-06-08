'use client'

import { ToggleButton } from '@/shared/ui'
import { MonsterTemplate, Prisma } from '@prisma/client'
import { useTranslations } from 'next-intl'
import { type InputHTMLAttributes, type Ref } from 'react'
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form'
import { sileo } from 'sileo'
import { useCreateMonster } from '../../api/encyclopedia-mutations'
import { MAIN_STATS, SMALL_STATS } from '../../lib/stats'
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

// ── Hexágono editable — misma geometría que StatBox pero con <input> ──────────
const { cos, sin, PI } = Math

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = -PI / 2 + (PI / 3) * i
    return `${(cx + r * cos(a)).toFixed(2)},${(cy + r * sin(a)).toFixed(2)}`
  }).join(' ')
}

function edgeTriangles(cx: number, cy: number, r: number, base: number, height: number) {
  const apothem = r * cos(PI / 6)
  return Array.from({ length: 6 }, (_, i) => {
    const a = -PI / 2 + (PI / 3) * i + PI / 6
    const mx = cx + apothem * cos(a)
    const my = cy + apothem * sin(a)
    const nx = cos(a)
    const ny = sin(a)
    const tx = -ny
    const ty = nx
    const hb = base / 2
    return (
      `M ${(mx + hb * tx).toFixed(2)},${(my + hb * ty).toFixed(2)} ` +
      `L ${(mx + height * nx).toFixed(2)},${(my + height * ny).toFixed(2)} ` +
      `L ${(mx - hb * tx).toFixed(2)},${(my - hb * ty).toFixed(2)}`
    )
  }).join(' ')
}

function EditableStatBox({
  label,
  boxSize = 'md',
  title,
  ref,
  ...props
}: {
  label: string
  boxSize?: 'sm' | 'md'
  title?: string
  ref?: Ref<HTMLInputElement>
} & InputHTMLAttributes<HTMLInputElement>) {
  const r = boxSize === 'sm' ? 24 : 33
  const innerR = boxSize === 'sm' ? 19 : 27
  const triBase = boxSize === 'sm' ? 15 : 17
  const triH = boxSize === 'sm' ? 3 : 5
  const pad = boxSize === 'sm' ? 3 : 4
  const apothem = r * cos(PI / 6)
  const svgW = Math.round(2 * (apothem + triH + pad))
  const svgH = Math.round(2 * (r + pad))
  const cx = svgW / 2
  const cy = svgH / 2

  return (
    <div
      className='relative flex items-center justify-center'
      style={{ width: svgW, height: svgH }}
      title={title}
    >
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className='absolute inset-0'>
        <polygon
          points={hexPoints(cx, cy, r)}
          fill='none'
          stroke='rgba(212,175,55,0.6)'
          strokeWidth='1.2'
        />
        <polygon
          points={hexPoints(cx, cy, innerR)}
          fill='rgba(245,158,11,0.04)'
          stroke='rgba(212,175,55,0.35)'
          strokeWidth='0.9'
        />
        <path
          d={edgeTriangles(cx, cy, r, triBase, triH)}
          fill='none'
          stroke='rgba(212,175,55,0.5)'
          strokeWidth='1'
          strokeLinejoin='round'
          strokeLinecap='round'
        />
      </svg>
      <div className='relative z-10 flex flex-col items-center justify-center gap-y-0.5 leading-none'>
        <span className='text-[8px] font-bold uppercase tracking-widest text-neutral-500'>
          {label}
        </span>
        <input
          type='number'
          ref={ref}
          {...props}
          className={`bg-transparent text-center font-mono font-bold text-neutral-400 focus:text-neutral-200 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${boxSize === 'md' ? 'w-10 text-sm' : 'w-8 text-xs'}`}
        />
      </div>
    </div>
  )
}

function StatBoxWithControls({
  fieldKey,
  label,
  boxSize = 'md',
  title,
  min,
  required,
}: {
  fieldKey: keyof MonsterFormFields
  label: string
  boxSize?: 'sm' | 'md'
  title?: string
  min?: number
  required?: boolean
}) {
  const { register, setValue, getValues } = useFormContext<MonsterFormFields>()
  const fieldProps = register(fieldKey, {
    valueAsNumber: true,
    ...(min !== undefined && { min }),
    ...(required && { required }),
  })

  const step = (delta: number) => {
    const current = Number(getValues(fieldKey)) || 0
    const next = current + delta
    if (min !== undefined && next < min) return
    setValue(fieldKey, next as never, { shouldDirty: true })
  }

  const btnBase =
    'flex items-center justify-center rounded-md border border-amber-800/30 bg-amber-950/20 font-bold text-amber-500/70 hover:bg-amber-900/30 hover:text-amber-400 active:bg-amber-800/30 transition-colors leading-none select-none cursor-pointer'
  const btnSize = boxSize === 'md' ? 'h-[20px] w-[23px] text-[19px]' : 'h-[18px] w-[22px] text-sm'

  return (
    <div className='flex items-center gap-1'>
      <EditableStatBox label={label} boxSize={boxSize} title={title} {...fieldProps} />
      <div className='flex flex-col gap-2'>
        <button type='button' onClick={() => step(1)} className={`${btnBase} ${btnSize}`}>
          +
        </button>
        <button type='button' onClick={() => step(-1)} className={`${btnBase} ${btnSize}`}>
          −
        </button>
      </div>
    </div>
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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods
  const isPublic = (useWatch({ control, name: 'isPublic' }) as boolean) ?? false

  const onSubmit = async (data: MonsterFormFields) => {
    try {
      const result = await createMonster.mutateAsync(data)
      if (!result.success || !result.data) {
        sileo.error({
          title: t('monsterForm.toastErrorTitle'),
          description: t('monsterForm.toastErrorDesc'),
        })
        return
      }
      setSelectedItemId(result.data.id)
      setIsCreatingNew(false)
      sileo.success({
        title: t('monsterForm.toastSuccessTitle'),
        description: t('monsterForm.toastSuccessDesc'),
      })
      onSuccess?.()
    } catch {
      sileo.error({
        title: t('monsterForm.toastErrorTitle'),
        description: t('monsterForm.toastErrorDesc'),
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-full flex-col overflow-y-auto scrollbar-encyclopedia lg:flex-row lg:overflow-visible'
      >
        <MonsterAvatarPanel />

        <div className='w-full space-y-6 border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-l lg:border-t-0 lg:overflow-y-auto lg:p-6 scrollbar-encyclopedia'>
          {/* Nombre + retrato */}
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
              className='flex-1 rounded-md bg-amber-600/80 py-2.5 text-sm font-bold text-neutral-100 transition-colors hover:bg-amber-500 disabled:opacity-50'
            >
              {mode === 'create' ? t('monsterForm.submitCreate') : t('monsterForm.submitEdit')}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
