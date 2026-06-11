const { cos, sin, PI } = Math

/** Puntos de un hexágono con punta hacia arriba (pointy-top), listos para <polygon points>. */
export function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = -PI / 2 + (PI / 3) * i
    return `${(cx + r * cos(a)).toFixed(2)},${(cy + r * sin(a)).toFixed(2)}`
  }).join(' ')
}

/** Triángulos decorativos centrados en cada arista del hexágono, apuntando hacia fuera. */
export function edgeTriangles(cx: number, cy: number, r: number, base: number, height: number): string {
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

/** Dimensiones y centro del lienzo SVG que envuelve el hexágono y sus triángulos. */
export function hexCanvas(r: number, triHeight: number, padding: number) {
  const apothem = r * cos(PI / 6)
  const width = Math.round(2 * (apothem + triHeight + padding))
  const height = Math.round(2 * (r + padding))
  return { width, height, cx: width / 2, cy: height / 2 }
}
