import { parseNote } from '../music/notes.ts'

export interface Tuning {
  readonly id: string
  readonly name: string
  readonly notes: readonly number[]
}

function tuning(id: string, name: string, spelled: string): Tuning {
  const notes = spelled.split(' ').map((text) => {
    const note = parseNote(text)
    if (note === null) throw new Error(`Invalid note "${text}" in tuning ${name}`)
    return note
  })
  return { id, name, notes }
}

export const STANDARD = tuning('standard', 'Standard', 'E2 A2 D3 G3 B3 E4')

export const TUNINGS: readonly Tuning[] = [
  STANDARD,
  tuning('half-step-down', 'Half step down', 'Eb2 Ab2 Db3 Gb3 Bb3 Eb4'),
  tuning('drop-d', 'Drop D', 'D2 A2 D3 G3 B3 E4'),
  tuning('dadgad', 'DADGAD', 'D2 A2 D3 G3 A3 D4'),
  tuning('open-g', 'Open G', 'D2 G2 D3 G3 B3 D4'),
  tuning('open-d', 'Open D', 'D2 A2 D3 F#3 A3 D4'),
  tuning('open-e', 'Open E', 'E2 B2 E3 G#3 B3 E4'),
  tuning('seven-string', '7-string standard', 'B1 E2 A2 D3 G3 B3 E4'),
  tuning('bass', '4-string bass', 'E1 A1 D2 G2'),
  tuning('ukulele', 'Ukulele (re-entrant)', 'G4 C4 E4 A4'),
]

export function findTuning(notes: readonly number[]): Tuning | undefined {
  return TUNINGS.find(
    (candidate) =>
      candidate.notes.length === notes.length && candidate.notes.every((note, index) => note === notes[index]),
  )
}
