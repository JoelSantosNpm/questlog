import type { ReactNode } from 'react'

interface StatBoxProps {
  label: string
  value: number | string
  icon?: ReactNode
  size?: 'sm' | 'md'
}

const { cos, sin, PI } = Math

// Puntos de hexágono con punta hacia arriba (pointy-top)
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = -PI / 2 + (PI / 3) * i
    return `${(cx + r * cos(a)).toFixed(2)},${(cy + r * sin(a)).toFixed(2)}`
  }).join(' ')
}

// Triángulos decorativos centrados en cada arista, apuntando hacia fuera
function edgeTriangles(cx: number, cy: number, r: number, base: number, height: number): string {
  const apothem = r * cos(PI / 6)
  return Array.from({ length: 6 }, (_, i) => {
    const a = -PI / 2 + (PI / 3) * i + PI / 6 // ángulo del punto medio de la arista
    const mx = cx + apothem * cos(a)
    const my = cy + apothem * sin(a)
    const nx = cos(a)
    const ny = sin(a) // normal exterior
    const tx = -ny
    const ty = nx // tangente a la arista
    const hb = base / 2
    return (
      `M ${(mx + hb * tx).toFixed(2)},${(my + hb * ty).toFixed(2)} ` +
      `L ${(mx + height * nx).toFixed(2)},${(my + height * ny).toFixed(2)} ` +
      `L ${(mx - hb * tx).toFixed(2)},${(my - hb * ty).toFixed(2)}`
    )
  }).join(' ')
}

export const StatBox = ({ label, value, icon, size = 'md' }: StatBoxProps) => {
  const r = size === 'sm' ? 24 : 33
  const innerR = size === 'sm' ? 19 : 27
  const triBase = size === 'sm' ? 15 : 17
  const triH = size === 'sm' ? 3 : 5
  const pad = size === 'sm' ? 3 : 4
  const apothem = r * cos(PI / 6)
  // Ancho: los triángulos del eje derecho/izquierdo sobresalen del vértice
  const svgW = Math.round(2 * (apothem + triH + pad))
  const svgH = Math.round(2 * (r + pad))
  const cx = svgW / 2
  const cy = svgH / 2
  const valStr = String(value)

  return (
    <div
      className='relative flex items-center justify-center'
      style={{ width: svgW, height: svgH }}
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
          {icon && <span className='text-amber-500/60'>{icon}</span>}
          <span
            className={`font-mono font-bold text-amber-500 ${
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
