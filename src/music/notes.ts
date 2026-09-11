export type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type Accidental = 'sharp' | 'flat'

export const SEMITONES_PER_OCTAVE = 12
export const LOWEST_NOTE = 0
export const HIGHEST_NOTE = 127

const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const
const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'] as const

const NATURAL_PITCH_CLASSES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

const NOTE_PATTERN = /^([A-Ga-g])([#♯]{1,2}|[b♭]{1,2})?(-?\d{1,2})$/

export function isValidNote(midi: number): boolean {
  return Number.isInteger(midi) && midi >= LOWEST_NOTE && midi <= HIGHEST_NOTE
}

export function pitchClassOf(midi: number): PitchClass {
  return (((midi % SEMITONES_PER_OCTAVE) + SEMITONES_PER_OCTAVE) % SEMITONES_PER_OCTAVE) as PitchClass
}

export function octaveOf(midi: number): number {
  return Math.floor(midi / SEMITONES_PER_OCTAVE) - 1
}

export function pitchClassName(pitchClass: PitchClass, accidental: Accidental): string {
  return (accidental === 'sharp' ? SHARP_NAMES : FLAT_NAMES)[pitchClass]
}

export function noteName(midi: number, accidental: Accidental): string {
  return `${pitchClassName(pitchClassOf(midi), accidental)}${octaveOf(midi)}`
}

export function parseNote(text: string): number | null {
  const match = NOTE_PATTERN.exec(text.trim())
  if (!match) return null
  const [, letter = '', accidentals = '', octave = ''] = match
  const natural = NATURAL_PITCH_CLASSES[letter.toUpperCase()]
  if (natural === undefined) return null
  const offset = /[#♯]/.test(accidentals) ? accidentals.length : -accidentals.length
  const midi = (Number(octave) + 1) * SEMITONES_PER_OCTAVE + natural + offset
  return isValidNote(midi) ? midi : null
}
