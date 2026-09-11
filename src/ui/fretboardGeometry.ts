import { SEMITONES_PER_OCTAVE } from '../music/notes.ts'

export interface FretSpan {
  readonly fret: number
  readonly start: number
  readonly end: number
}

export function fretSpans(fretCount: number, neckLength: number): FretSpan[] {
  const distanceFromNut = (fret: number) => 1 - 2 ** (-fret / SEMITONES_PER_OCTAVE)
  const scale = neckLength / distanceFromNut(fretCount)
  return Array.from({ length: fretCount }, (_, index) => ({
    fret: index + 1,
    start: distanceFromNut(index) * scale,
    end: distanceFromNut(index + 1) * scale,
  }))
}

export function inlayCount(fret: number): 0 | 1 | 2 {
  if (fret <= 0) return 0
  const withinOctave = fret % SEMITONES_PER_OCTAVE
  if (withinOctave === 0) return 2
  return [3, 5, 7, 9].includes(withinOctave) ? 1 : 0
}

export function stringThickness(openNote: number): number {
  return Math.min(3.2, Math.max(0.9, 0.9 + (72 - openNote) * 0.07))
}
