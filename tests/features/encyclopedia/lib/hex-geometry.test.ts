import { edgeTriangles, hexCanvas, hexPoints } from '@/views/encyclopedia/lib/hex-geometry'
import { describe, expect, it } from 'vitest'

// ─── hexPoints ────────────────────────────────────────────────────────────────

describe('hexPoints', () => {
  it('devuelve exactamente 6 pares de coordenadas separados por espacios', () => {
    const result = hexPoints(0, 0, 1)
    const pairs = result.split(' ')
    expect(pairs).toHaveLength(6)
    pairs.forEach((pair) => expect(pair).toMatch(/^-?\d+\.\d{2},-?\d+\.\d{2}$/))
  })

  it('calcula los 6 vértices correctos para el hexágono unitario centrado en el origen', () => {
    // pointy-top: primer vértice apunta hacia arriba (ángulo -PI/2)
    const result = hexPoints(0, 0, 1)
    expect(result).toBe('0.00,-1.00 0.87,-0.50 0.87,0.50 0.00,1.00 -0.87,0.50 -0.87,-0.50')
  })

  it('desplaza todos los vértices por el offset cx,cy', () => {
    const atOrigin = hexPoints(0, 0, 1).split(' ')
    const shifted = hexPoints(10, 5, 1).split(' ')

    atOrigin.forEach((pair, i) => {
      const [x0, y0] = pair.split(',').map(Number)
      const [xs, ys] = shifted[i].split(',').map(Number)
      expect(xs).toBeCloseTo(x0 + 10, 1)
      expect(ys).toBeCloseTo(y0 + 5, 1)
    })
  })

  it('escala los vértices proporcionalmente al radio', () => {
    const r1 = hexPoints(0, 0, 1).split(' ')
    const r3 = hexPoints(0, 0, 3).split(' ')

    r1.forEach((pair, i) => {
      const [x1, y1] = pair.split(',').map(Number)
      const [x3, y3] = r3[i].split(',').map(Number)
      expect(x3).toBeCloseTo(x1 * 3, 1)
      expect(y3).toBeCloseTo(y1 * 3, 1)
    })
  })
})

// ─── hexCanvas ────────────────────────────────────────────────────────────────

describe('hexCanvas', () => {
  it('devuelve valores enteros para width y height (Math.round)', () => {
    const { width, height } = hexCanvas(50, 5, 2)
    expect(Number.isInteger(width)).toBe(true)
    expect(Number.isInteger(height)).toBe(true)
  })

  it('calcula dimensiones correctas para r=50, triHeight=5, padding=2', () => {
    // apothem = 50 * cos(PI/6) ≈ 43.30
    // width  = round(2 * (43.30 + 5 + 2)) = round(100.60) = 101
    // height = round(2 * (50 + 2))         = round(104)    = 104
    const { width, height } = hexCanvas(50, 5, 2)
    expect(width).toBe(101)
    expect(height).toBe(104)
  })

  it('centra el canvas: cx = width / 2, cy = height / 2', () => {
    const { width, height, cx, cy } = hexCanvas(50, 5, 2)
    expect(cx).toBe(width / 2)
    expect(cy).toBe(height / 2)
  })

  it('el padding cero y sin triángulos produce las dimensiones mínimas del hexágono', () => {
    // width  = round(2 * apothem) = round(2 * r * cos(PI/6))
    // height = round(2 * r)
    const r = 40
    const { width, height } = hexCanvas(r, 0, 0)
    expect(width).toBe(Math.round(2 * r * Math.cos(Math.PI / 6)))
    expect(height).toBe(Math.round(2 * r))
  })

  it('triHeight y padding aumentan las dimensiones respecto al caso base', () => {
    const base = hexCanvas(50, 0, 0)
    const withExtras = hexCanvas(50, 8, 4)
    expect(withExtras.width).toBeGreaterThan(base.width)
    expect(withExtras.height).toBeGreaterThan(base.height)
  })
})

// ─── edgeTriangles ────────────────────────────────────────────────────────────

describe('edgeTriangles', () => {
  it('genera exactamente 6 segmentos de triángulo (uno por arista)', () => {
    const result = edgeTriangles(0, 0, 50, 4, 6)
    const mCount = (result.match(/M /g) ?? []).length
    expect(mCount).toBe(6)
  })

  it('cada segmento contiene exactamente 2 comandos L (triángulo de 3 puntos)', () => {
    const result = edgeTriangles(0, 0, 50, 4, 6)
    const lCount = (result.match(/ L /g) ?? []).length
    expect(lCount).toBe(12) // 2 por cada uno de los 6 triángulos
  })

  it('todas las coordenadas tienen 2 decimales', () => {
    const result = edgeTriangles(0, 0, 50, 4, 6)
    const coords = result.match(/-?\d+\.\d+/g) ?? []
    coords.forEach((c) => expect(c).toMatch(/\.\d{2}$/))
  })

  it('el offset cx,cy desplaza todos los puntos generados', () => {
    const atOrigin = edgeTriangles(0, 0, 50, 4, 6)
    const shifted = edgeTriangles(100, 0, 50, 4, 6)
    // Un punto de la versión desplazada no debería aparecer en la versión en origen
    expect(shifted).not.toBe(atOrigin)
    // Los primeros números del desplazado deben ser ~100 más que los del origen
    const firstXOrigin = parseFloat(atOrigin.match(/-?\d+\.\d+/)![0])
    const firstXShifted = parseFloat(shifted.match(/-?\d+\.\d+/)![0])
    expect(firstXShifted).toBeCloseTo(firstXOrigin + 100, 1)
  })
})
