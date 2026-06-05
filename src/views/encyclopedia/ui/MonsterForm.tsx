'use client'

import { MonsterTemplate, Prisma } from '@prisma/client'
import { Camera } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { sileo } from 'sileo'
import ImageUploader from '@/shared/ui/image-uploader/ImageUploader'
import { ToggleButton } from '@/shared/ui'
import { useCreateMonster } from '../api/encyclopedia-mutations'
import { MAIN_STATS, SMALL_STATS, type NumericStatKey } from '../config/stats'
import { useSetIsCreatingNew, useSetSelectedItemId } from '../model/encyclopediaStore'
import { PortraitFrame } from './PortraitFrame'

// Campos escalares del formulario — derivados directamente del tipo Prisma
type MonsterFormFields = Pick<
  Prisma.MonsterTemplateCreateInput,
  | 'name' | 'type' | 'race' | 'characterClass' | 'description'
  | 'imageUrl' | 'portraitImageUrl' | 'isPublic' | 'maxHp'
  | 'challenge' | 'ac' | 'speed' | 'strength' | 'dexterity'
  | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
  | 'initiativeBonus' | 'perception'
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

const StatInput = forwardRef<
  HTMLInputElement,
  { label: string } & InputHTMLAttributes<HTMLInputElement>
>(({ label, ...props }, ref) => (
  <label className="flex flex-col gap-1">
    <span className="truncate text-[10px] font-bold uppercase tracking-widest text-neutral-500">
      {label}
    </span>
    <input
      type="number"
      ref={ref}
      {...props}
      className="input-encyclopedia w-full text-center font-mono font-bold text-neutral-200"
    />
  </label>
))
StatInput.displayName = 'StatInput'

export function MonsterForm({ mode = 'create', initialData, onSuccess }: MonsterFormProps) {
  const t = useTranslations('Encyclopedia')
  const createMonster = useCreateMonster()
  const setSelectedItemId = useSetSelectedItemId()
  const setIsCreatingNew = useSetIsCreatingNew()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<MonsterFormFields>({
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

  const bgImageUrl = watch('imageUrl') as string | undefined
  const portraitUrl = watch('portraitImageUrl') as string | undefined

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

  const numericField = (key: NumericStatKey) =>
    register(key as keyof MonsterFormFields, { valueAsNumber: true })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row lg:h-full">

      {/* ── Panel izquierdo — previsualización imagen de fondo ── */}
      <div className="relative h-[50vw] min-h-64 shrink-0 overflow-hidden lg:min-w-[60%] lg:flex-1 lg:h-full">

        {/* Fondo biblioteca (siempre visible, igual que DetailView) */}
        <Image
          src="/bg_biblioteca.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Previsualización de la imagen del monstruo (misma posición que EncyclopediaImage) */}
        {bgImageUrl && (
          <div
            className="absolute w-full max-w-sm"
            style={{
              top: 'calc(72% - 55%)',
              height: '55%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-2xl" />
            <div className="relative h-full w-full">
              <Image
                src={bgImageUrl}
                alt="preview"
                fill
                className="object-contain transition-all duration-500"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Uploader de imagen de fondo — anclado en la zona inferior con degradado */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 pt-10">
          <ImageUploader
            storagePath="monsters"
            label={t('monsterForm.imageBg')}
            onUpload={(url) => setValue('imageUrl', url)}
          />
        </div>
      </div>

      {/* ── Panel derecho — retrato + campos del formulario ── */}
      <div className="w-full space-y-6 border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-l lg:border-t-0 lg:overflow-y-auto lg:p-6 scrollbar-encyclopedia">

        {/* Retrato + nombre (espejo del ItemHeader) */}
        <header>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Previsualización del retrato */}
            {portraitUrl ? (
              <div className="shrink-0">
                <PortraitFrame src={portraitUrl} alt="Portrait preview" variant="monster" />
              </div>
            ) : (
              <div className="size-28 shrink-0 rounded-full border-2 border-dashed border-neutral-700 bg-neutral-900/50 flex items-center justify-center">
                <Camera className="size-8 text-neutral-600" />
              </div>
            )}
            {/* Input nombre */}
            <input
              {...register('name', { required: true })}
              placeholder={t('monsterForm.namePlaceholder')}
              className="w-full border-b border-neutral-700 bg-transparent pb-1 text-2xl font-bold text-neutral-100 focus:border-amber-500/50 focus:outline-none font-medieval"
            />
          </div>

          {/* Uploader de retrato — compacto, bajo el portrait */}
          <div className="mt-3">
            <ImageUploader
              storagePath="monsters"
              label={t('monsterForm.imagePortrait')}
              onUpload={(url) => setValue('portraitImageUrl', url)}
            />
          </div>
        </header>

        {/* Metadatos — 2 columnas */}
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register('type', { required: true })}
            placeholder={t('monsterForm.typePlaceholder')}
            className="input-encyclopedia"
          />
          <input
            {...register('race')}
            placeholder={t('monsterForm.racePlaceholder')}
            className="input-encyclopedia"
          />
          <input
            {...register('characterClass')}
            placeholder={t('monsterForm.classPlaceholder')}
            className="input-encyclopedia"
          />
          <ToggleButton
            label={t('monsterForm.publicLabel')}
            isActive={(watch('isPublic') as boolean) ?? false}
            onToggle={() => setValue('isPublic', !watch('isPublic'))}
          />
        </div>

        {/* Descripción */}
        <textarea
          {...register('description')}
          placeholder={t('monsterForm.descriptionPlaceholder')}
          rows={3}
          className="input-encyclopedia w-full resize-none"
        />

        {/* Estadísticas de combate: maxHp + challenge + MAIN_STATS (ac, speed) */}
        <section>
          <h3 className="section-label mb-3">{t('monsterForm.sectionStats')}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatInput
              label={t('monsterForm.fieldMaxHp')}
              {...register('maxHp', { required: true, valueAsNumber: true, min: 1 })}
            />
            <StatInput
              label={t('monsterForm.fieldChallenge')}
              {...register('challenge', { valueAsNumber: true, min: 0 })}
            />
            {MAIN_STATS.map((stat) => (
              <StatInput key={stat.key} label={stat.title} {...numericField(stat.key)} />
            ))}
          </div>
        </section>

        {/* Atributos: SMALL_STATS aplanado (8 campos) */}
        <section>
          <h3 className="section-label mb-3">{t('monsterForm.sectionAttributes')}</h3>
          <div className="grid grid-cols-4 gap-3">
            {[...SMALL_STATS[0], ...SMALL_STATS[1]].map((stat) => (
              <StatInput key={stat.key} label={stat.title} {...numericField(stat.key)} />
            ))}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-amber-600/80 py-2.5 text-sm font-bold text-neutral-100 transition-colors hover:bg-amber-500 disabled:opacity-50"
        >
          {mode === 'create' ? t('monsterForm.submitCreate') : t('monsterForm.submitEdit')}
        </button>

      </div>
    </form>
  )
}
