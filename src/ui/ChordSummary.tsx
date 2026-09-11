import type { Fretboard } from '../fretboard/fretboard.ts'
import { formatVoicing, type Voicing, voicingNotes, voicingPitchClasses } from '../fretboard/voicing.ts'
import { type Accidental, noteName, pitchClassName } from '../music/notes.ts'

interface ChordSummaryProps {
  board: Fretboard
  voicing: Voicing
  accidental: Accidental
  onClear: () => void
}

export function ChordSummary({ board, voicing, accidental, onClear }: ChordSummaryProps) {
  const notes = voicingNotes(board, voicing)
  const pitchClasses = voicingPitchClasses(board, voicing)

  return (
    <section className="panel summary" aria-label="Shape">
      <div className="summary-header">
        <h2>Shape</h2>
        <button type="button" onClick={onClear} disabled={notes.length === 0}>
          Clear
        </button>
      </div>
      {notes.length === 0 ? (
        <p className="hint">Click a fret on any string to place a note. Click it again to lift it.</p>
      ) : (
        <dl>
          <dt>Frets</dt>
          <dd className="shape">{formatVoicing(voicing)}</dd>
          <dt>Notes</dt>
          <dd>{notes.map((note) => noteName(note, accidental)).join('  ')}</dd>
          <dt>Pitch classes</dt>
          <dd>{pitchClasses.map((pitchClass) => pitchClassName(pitchClass, accidental)).join('  ')}</dd>
        </dl>
      )}
    </section>
  )
}
