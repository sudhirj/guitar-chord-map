import type { Dispatch } from 'react'
import type { Action } from '../app/state.ts'
import { canAddString, canRemoveString, type Fretboard, MAX_FRETS, MIN_FRETS } from '../fretboard/fretboard.ts'
import { findTuning, TUNINGS } from '../fretboard/tunings.ts'
import { type Accidental, isValidNote, noteName } from '../music/notes.ts'

const CUSTOM_TUNING = 'custom'

interface TuningEditorProps {
  board: Fretboard
  accidental: Accidental
  showAllNotes: boolean
  dispatch: Dispatch<Action>
}

export function TuningEditor({ board, accidental, showAllNotes, dispatch }: TuningEditorProps) {
  const preset = findTuning(board.tuning)

  function applyPreset(id: string) {
    const next = TUNINGS.find((candidate) => candidate.id === id)
    if (next) dispatch({ type: 'applyTuning', notes: next.notes })
  }

  return (
    <section className="panel" aria-label="Tuning">
      <div className="controls">
        <label className="field">
          <span>Tuning</span>
          <select value={preset?.id ?? CUSTOM_TUNING} onChange={(event) => applyPreset(event.target.value)}>
            {TUNINGS.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
            {preset === undefined && <option value={CUSTOM_TUNING}>Custom</option>}
          </select>
        </label>
        <label className="field">
          <span>Frets</span>
          <input
            type="range"
            min={MIN_FRETS}
            max={MAX_FRETS}
            value={board.fretCount}
            onChange={(event) => dispatch({ type: 'setFretCount', fretCount: event.target.valueAsNumber })}
          />
          <output className="fret-count">{board.fretCount}</output>
        </label>
        <div className="field" role="group" aria-label="Spelling">
          <span>Spelling</span>
          <div className="segmented">
            <button
              type="button"
              aria-pressed={accidental === 'sharp'}
              onClick={() => dispatch({ type: 'setAccidental', accidental: 'sharp' })}
            >
              ♯
            </button>
            <button
              type="button"
              aria-pressed={accidental === 'flat'}
              onClick={() => dispatch({ type: 'setAccidental', accidental: 'flat' })}
            >
              ♭
            </button>
          </div>
        </div>
        <label className="field">
          <input
            type="checkbox"
            checked={showAllNotes}
            onChange={(event) => dispatch({ type: 'setShowAllNotes', showAllNotes: event.target.checked })}
          />
          <span>Show all notes</span>
        </label>
      </div>
      <ol className="strings">
        <li>
          <button
            type="button"
            className="add-string"
            aria-label="Add a lower string"
            disabled={!canAddString(board, 'low')}
            onClick={() => dispatch({ type: 'addString', edge: 'low' })}
          >
            +
          </button>
        </li>
        {board.tuning.map((open, string) => {
          const number = board.tuning.length - string
          return (
            <li key={string} className="string-chip">
              <span className="string-number">{number}</span>
              <button
                type="button"
                aria-label={`Raise string ${number}`}
                disabled={!isValidNote(open + 1)}
                onClick={() => dispatch({ type: 'shiftString', string, semitones: 1 })}
              >
                ▲
              </button>
              <span className="string-note">{noteName(open, accidental)}</span>
              <button
                type="button"
                aria-label={`Lower string ${number}`}
                disabled={!isValidNote(open - 1)}
                onClick={() => dispatch({ type: 'shiftString', string, semitones: -1 })}
              >
                ▼
              </button>
              <button
                type="button"
                className="remove-string"
                aria-label={`Remove string ${number}`}
                disabled={!canRemoveString(board, string)}
                onClick={() => dispatch({ type: 'removeString', string })}
              >
                ×
              </button>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            className="add-string"
            aria-label="Add a higher string"
            disabled={!canAddString(board, 'high')}
            onClick={() => dispatch({ type: 'addString', edge: 'high' })}
          >
            +
          </button>
        </li>
      </ol>
    </section>
  )
}
