'use client'

import { type InputHTMLAttributes, type Ref } from 'react'
import { edgeTriangles, hexCanvas, hexPoints } from '../../lib/hex-geometry'

// ── Hexágono editable — misma geometría que StatBox pero con <input> ──────────

export function EditableStatBox({
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
  const { width: svgW, height: svgH, cx, cy } = hexCanvas(r, triH, pad)

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
