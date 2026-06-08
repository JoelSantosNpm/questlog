'use client'

import { useFormContext } from 'react-hook-form'
import { EditableStatBox } from './EditableStatBox'
import type { MonsterFormFields } from './monster-form-fields'

const BUTTON_BASE =
  'flex items-center justify-center rounded-md border border-amber-800/30 bg-amber-950/20 font-bold text-amber-500/70 hover:bg-amber-900/30 hover:text-amber-400 active:bg-amber-800/30 transition-colors leading-none select-none cursor-pointer'

const BUTTON_SIZE: Record<'sm' | 'md', string> = {
  md: 'h-[23px] w-[26px] text-[19px]',
  sm: 'h-[20px] w-[23px] text-sm',
}

export function StatBoxWithControls({
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

  const buttonClassName = `${BUTTON_BASE} ${BUTTON_SIZE[boxSize]}`

  return (
    <div className='flex flex-col items-center gap-1'>
      <EditableStatBox label={label} boxSize={boxSize} title={title} {...fieldProps} />
      <div className='flex flex-row gap-3'>
        <button type='button' onClick={() => step(1)} className={buttonClassName}>
          +
        </button>
        <button type='button' onClick={() => step(-1)} className={buttonClassName}>
          −
        </button>
      </div>
    </div>
  )
}
