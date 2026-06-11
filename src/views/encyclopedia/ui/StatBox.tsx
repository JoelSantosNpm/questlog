import type { ReactNode } from 'react'
import { edgeTriangles, hexCanvas, hexPoints } from '../lib/hex-geometry'

interface StatBoxProps {
  label: string
  value: number | string
  icon?: ReactNode
  size?: 'sm' | 'md'
  title?: string
}

export const StatBox = ({ label, value, icon, size = 'md', title }: StatBoxProps) => {
  const r = size === 'sm' ? 24 : 33
  const innerR = size === 'sm' ? 19 : 27
  const triBase = size === 'sm' ? 15 : 17
  const triH = size === 'sm' ? 3 : 5
  const pad = size === 'sm' ? 3 : 4
  const { width: svgW, height: svgH, cx, cy } = hexCanvas(r, triH, pad)
  const valStr = String(value)

  return (
    <div
      className='relative flex items-center justify-center'
      style={{ width: svgW, height: svgH }}
      title={title}
    >
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className='absolute inset-0'>
        {/* Hexágono exterior */}
        <polygon
          points={hexPoints(cx, cy, r)}
          fill='none'
          stroke='rgba(212, 175, 55, 0.6)'
          strokeWidth='1.2'
        />
        {/* Hexágono interior — doble borde */}
        <polygon
          points={hexPoints(cx, cy, innerR)}
          fill='rgba(245,158,11,0.04)'
          stroke='rgba(212, 175, 55,0.35)'
          strokeWidth='0.9'
        />
        {/* Triángulos en cada arista */}
        <path
          d={edgeTriangles(cx, cy, r, triBase, triH)}
          fill='none'
          stroke='rgba(212, 175, 55,0.5)'
          strokeWidth='1'
          strokeLinejoin='round'
          strokeLinecap='round'
        />
      </svg>
      <div className='relative z-10 flex flex-col items-center justify-center gap-y-0.5 leading-none'>
        <span className='text-[8px] font-bold uppercase tracking-widest text-neutral-500'>
          {label}
        </span>
        <div className='flex items-center gap-0.5'>
          {icon && <span className='text-neutral-500'>{icon}</span>}
          <span
            className={`font-mono font-bold text-neutral-400 ${
              valStr.length > 4 ? 'text-[8px]' : size === 'md' ? 'text-sm' : 'text-xs'
            }`}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}
