import {
  addString,
  canAddString,
  canRemoveString,
  createFretboard,
  type Fretboard,
  type FretPosition,
  isOnBoard,
  isValidFretCount,
  removeString,
  retuneString,
  type StringEdge,
  withFretCount,
} from '../fretboard/fretboard.ts'
import { STANDARD } from '../fretboard/tunings.ts'
import {
  addStringToVoicing,
  emptyVoicing,
  limitVoicingToFrets,
  removeStringFromVoicing,
  toggleFret,
  type Voicing,
} from '../fretboard/voicing.ts'
import { type Accidental, isValidNote } from '../music/notes.ts'

export interface AppState {
  readonly board: Fretboard
  readonly voicing: Voicing
  readonly accidental: Accidental
  readonly showAllNotes: boolean
}

export type Action =
  | { readonly type: 'applyTuning'; readonly notes: readonly number[] }
  | { readonly type: 'shiftString'; readonly string: number; readonly semitones: number }
  | { readonly type: 'addString'; readonly edge: StringEdge }
  | { readonly type: 'removeString'; readonly string: number }
  | { readonly type: 'setFretCount'; readonly fretCount: number }
  | { readonly type: 'toggleFret'; readonly position: FretPosition }
  | { readonly type: 'clearVoicing' }
  | { readonly type: 'setAccidental'; readonly accidental: Accidental }
  | { readonly type: 'setShowAllNotes'; readonly showAllNotes: boolean }

export const initialState: AppState = {
  board: createFretboard(STANDARD.notes, 15),
  voicing: emptyVoicing(STANDARD.notes.length),
  accidental: 'sharp',
  showAllNotes: false,
}

export function reducer(state: AppState, action: Action): AppState {
  const { board, voicing } = state
  switch (action.type) {
    case 'applyTuning': {
      const next = createFretboard(action.notes, board.fretCount)
      const sameStringCount = next.tuning.length === board.tuning.length
      return { ...state, board: next, voicing: sameStringCount ? voicing : emptyVoicing(next.tuning.length) }
    }
    case 'shiftString': {
      const open = board.tuning[action.string]
      if (open === undefined || !isValidNote(open + action.semitones)) return state
      return { ...state, board: retuneString(board, action.string, open + action.semitones) }
    }
    case 'addString':
      if (!canAddString(board, action.edge)) return state
      return { ...state, board: addString(board, action.edge), voicing: addStringToVoicing(voicing, action.edge) }
    case 'removeString':
      if (!canRemoveString(board, action.string)) return state
      return {
        ...state,
        board: removeString(board, action.string),
        voicing: removeStringFromVoicing(voicing, action.string),
      }
    case 'setFretCount':
      if (!isValidFretCount(action.fretCount)) return state
      return {
        ...state,
        board: withFretCount(board, action.fretCount),
        voicing: limitVoicingToFrets(voicing, action.fretCount),
      }
    case 'toggleFret':
      if (!isOnBoard(board, action.position)) return state
      return { ...state, voicing: toggleFret(voicing, action.position) }
    case 'clearVoicing':
      return { ...state, voicing: emptyVoicing(board.tuning.length) }
    case 'setAccidental':
      return { ...state, accidental: action.accidental }
    case 'setShowAllNotes':
      return { ...state, showAllNotes: action.showAllNotes }
  }
}
