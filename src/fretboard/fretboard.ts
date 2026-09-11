import { isValidNote, type PitchClass, pitchClassOf } from '../music/notes.ts'

export interface Fretboard {
  readonly tuning: readonly number[]
  readonly fretCount: number
}

export interface FretPosition {
  readonly string: number
  readonly fret: number
}

export type StringEdge = 'low' | 'high'

export const MIN_FRETS = 1
export const MAX_FRETS = 24
export const MAX_STRINGS = 12

const PERFECT_FOURTH = 5

export function isValidFretCount(fretCount: number): boolean {
  return Number.isInteger(fretCount) && fretCount >= MIN_FRETS && fretCount <= MAX_FRETS
}

export function createFretboard(tuning: readonly number[], fretCount: number): Fretboard {
  if (tuning.length === 0 || tuning.length > MAX_STRINGS) {
    throw new RangeError(`A fretboard needs between 1 and ${MAX_STRINGS} strings, got ${tuning.length}`)
  }
  const invalid = tuning.find((note) => !isValidNote(note))
  if (invalid !== undefined) throw new RangeError(`Invalid open string note ${invalid}`)
  if (!isValidFretCount(fretCount)) {
    throw new RangeError(`Fret count must be an integer from ${MIN_FRETS} to ${MAX_FRETS}, got ${fretCount}`)
  }
  return { tuning: [...tuning], fretCount }
}

export function isOnBoard(board: Fretboard, position: FretPosition): boolean {
  return (
    Number.isInteger(position.string) &&
    position.string >= 0 &&
    position.string < board.tuning.length &&
    Number.isInteger(position.fret) &&
    position.fret >= 0 &&
    position.fret <= board.fretCount
  )
}

export function noteAt(board: Fretboard, position: FretPosition): number {
  const open = board.tuning[position.string]
  if (open === undefined || !isOnBoard(board, position)) {
    throw new RangeError(`String ${position.string}, fret ${position.fret} is not on this fretboard`)
  }
  return open + position.fret
}

export function fretsOf(board: Fretboard): number[] {
  return Array.from({ length: board.fretCount + 1 }, (_, fret) => fret)
}

export function positionsOf(board: Fretboard, pitchClass: PitchClass): FretPosition[] {
  return board.tuning.flatMap((open, string) =>
    fretsOf(board)
      .filter((fret) => pitchClassOf(open + fret) === pitchClass)
      .map((fret) => ({ string, fret })),
  )
}

export function withFretCount(board: Fretboard, fretCount: number): Fretboard {
  return createFretboard(board.tuning, fretCount)
}

export function retuneString(board: Fretboard, string: number, note: number): Fretboard {
  if (!isOnBoard(board, { string, fret: 0 })) throw new RangeError(`No string ${string} on this fretboard`)
  if (!isValidNote(note)) throw new RangeError(`Invalid open string note ${note}`)
  return createFretboard(
    board.tuning.map((open, index) => (index === string ? note : open)),
    board.fretCount,
  )
}

function noteBeyondEdge(board: Fretboard, edge: StringEdge): number | undefined {
  const edgeNote = edge === 'low' ? board.tuning[0] : board.tuning[board.tuning.length - 1]
  if (edgeNote === undefined) return undefined
  return edge === 'low' ? edgeNote - PERFECT_FOURTH : edgeNote + PERFECT_FOURTH
}

export function canAddString(board: Fretboard, edge: StringEdge): boolean {
  const note = noteBeyondEdge(board, edge)
  return board.tuning.length < MAX_STRINGS && note !== undefined && isValidNote(note)
}

export function addString(board: Fretboard, edge: StringEdge): Fretboard {
  const note = noteBeyondEdge(board, edge)
  if (note === undefined || !canAddString(board, edge)) {
    throw new RangeError(`Cannot add a string on the ${edge} edge of this fretboard`)
  }
  const tuning = edge === 'low' ? [note, ...board.tuning] : [...board.tuning, note]
  return createFretboard(tuning, board.fretCount)
}

export function canRemoveString(board: Fretboard, string: number): boolean {
  return board.tuning.length > 1 && isOnBoard(board, { string, fret: 0 })
}

export function removeString(board: Fretboard, string: number): Fretboard {
  if (!canRemoveString(board, string)) throw new RangeError(`Cannot remove string ${string} from this fretboard`)
  return createFretboard(
    board.tuning.filter((_, index) => index !== string),
    board.fretCount,
  )
}
