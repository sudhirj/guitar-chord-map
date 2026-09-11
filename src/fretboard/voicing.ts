import { type PitchClass, pitchClassOf } from '../music/notes.ts'
import { type Fretboard, type FretPosition, noteAt, type StringEdge } from './fretboard.ts'

export type Voicing = readonly (number | null)[]

export function emptyVoicing(stringCount: number): Voicing {
  return Array.from({ length: stringCount }, () => null)
}

export function toggleFret(voicing: Voicing, position: FretPosition): Voicing {
  return voicing.map((fret, string) => {
    if (string !== position.string) return fret
    return fret === position.fret ? null : position.fret
  })
}

export function voicingPositions(voicing: Voicing): FretPosition[] {
  return voicing.flatMap((fret, string) => (fret == null ? [] : [{ string, fret }]))
}

export function voicingNotes(board: Fretboard, voicing: Voicing): number[] {
  return voicingPositions(voicing).map((position) => noteAt(board, position))
}

export function voicingPitchClasses(board: Fretboard, voicing: Voicing): PitchClass[] {
  return [...new Set(voicingNotes(board, voicing).map((note) => pitchClassOf(note)))]
}

export function formatVoicing(voicing: Voicing): string {
  const symbols = voicing.map((fret) => (fret == null ? 'x' : String(fret)))
  return voicing.some((fret) => fret != null && fret >= 10) ? symbols.join('-') : symbols.join('')
}

export function addStringToVoicing(voicing: Voicing, edge: StringEdge): Voicing {
  return edge === 'low' ? [null, ...voicing] : [...voicing, null]
}

export function removeStringFromVoicing(voicing: Voicing, string: number): Voicing {
  return voicing.filter((_, index) => index !== string)
}

export function limitVoicingToFrets(voicing: Voicing, fretCount: number): Voicing {
  return voicing.map((fret) => (fret != null && fret > fretCount ? null : fret))
}
