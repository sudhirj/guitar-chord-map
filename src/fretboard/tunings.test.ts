import { describe, expect, it } from 'vitest'
import { createFretboard } from './fretboard.ts'
import { findTuning, STANDARD, TUNINGS } from './tunings.ts'

describe('tunings', () => {
  it('spells standard tuning from low E to high E', () => {
    expect(STANDARD.notes).toEqual([40, 45, 50, 55, 59, 64])
  })

  it('gives every preset a unique id and a valid fretboard', () => {
    expect(new Set(TUNINGS.map((preset) => preset.id)).size).toBe(TUNINGS.length)
    for (const preset of TUNINGS) {
      expect(() => createFretboard(preset.notes, 12)).not.toThrow()
    }
  })

  it('recognises a preset from its notes and reports custom tunings as unknown', () => {
    expect(findTuning([38, 45, 50, 55, 59, 64])?.id).toBe('drop-d')
    expect(findTuning([67, 60, 64, 69])?.id).toBe('ukulele')
    expect(findTuning([40, 45, 50, 55, 59])).toBeUndefined()
    expect(findTuning([41, 45, 50, 55, 59, 64])).toBeUndefined()
  })
})
