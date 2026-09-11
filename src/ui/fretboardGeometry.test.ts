import { describe, expect, it } from 'vitest'
import { fretSpans, inlayCount, stringThickness } from './fretboardGeometry.ts'

describe('fretSpans', () => {
  it('fills the neck from the nut to the last fret without gaps', () => {
    const spans = fretSpans(15, 900)
    expect(spans).toHaveLength(15)
    expect(spans[0]?.start).toBe(0)
    expect(spans.at(-1)?.end).toBeCloseTo(900)
    spans.slice(1).forEach((span, index) => {
      expect(span.start).toBe(spans[index]?.end)
    })
  })

  it('narrows each fret by a twelfth-root-of-two ratio', () => {
    const widths = fretSpans(24, 1000).map((span) => span.end - span.start)
    widths.slice(1).forEach((width, index) => {
      expect(width / (widths[index] ?? Number.NaN)).toBeCloseTo(2 ** (-1 / 12))
    })
  })
})

describe('inlayCount', () => {
  it('marks the conventional frets with single and double dots', () => {
    expect([0, 1, 3, 5, 7, 9, 11, 12, 15, 17, 19, 21, 24].map(inlayCount)).toEqual([
      0, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 2,
    ])
  })
})

describe('stringThickness', () => {
  it('draws lower strings thicker, within bounds', () => {
    expect(stringThickness(40)).toBeGreaterThan(stringThickness(64))
    expect(stringThickness(0)).toBe(3.2)
    expect(stringThickness(127)).toBe(0.9)
  })
})
