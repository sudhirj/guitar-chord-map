import type { KeyboardEvent } from 'react'
import { type Fretboard as FretboardModel, type FretPosition, noteAt } from '../fretboard/fretboard.ts'
import type { Voicing } from '../fretboard/voicing.ts'
import { type Accidental, noteName, pitchClassName, pitchClassOf } from '../music/notes.ts'
import { type FretSpan, fretSpans, inlayCount, stringThickness } from './fretboardGeometry.ts'

const VIEW_WIDTH = 1000
const LABEL_WIDTH = 46
const OPEN_WIDTH = 46
const NUT_WIDTH = 6
const NECK_LEFT = LABEL_WIDTH + OPEN_WIDTH
const RIGHT_PADDING = 10
const NECK_LENGTH = VIEW_WIDTH - NECK_LEFT - RIGHT_PADDING
const STRING_GAP = 32
const TOP_PADDING = 12
const BOTTOM_PADDING = 32
const MARKER_RADIUS = 12
const INLAY_RADIUS = 5

interface FretboardProps {
  board: FretboardModel
  voicing: Voicing
  accidental: Accidental
  showAllNotes: boolean
  onToggle: (position: FretPosition) => void
}

export function Fretboard({ board, voicing, accidental, showAllNotes, onToggle }: FretboardProps) {
  const stringCount = board.tuning.length
  const neckHeight = stringCount * STRING_GAP
  const neckBottom = TOP_PADDING + neckHeight
  const viewHeight = neckBottom + BOTTOM_PADDING
  const spans = fretSpans(board.fretCount, NECK_LENGTH).map((span) => ({
    fret: span.fret,
    start: span.start + NECK_LEFT,
    end: span.end + NECK_LEFT,
  }))
  const openSpan: FretSpan = { fret: 0, start: LABEL_WIDTH, end: NECK_LEFT - NUT_WIDTH }
  const strings = board.tuning.map((open, string) => ({
    open,
    string,
    y: TOP_PADDING + (stringCount - 1 - string + 0.5) * STRING_GAP,
  }))
  const hasShape = voicing.some((fret) => fret != null)

  return (
    <svg className="fretboard" viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`} role="group" aria-label="Fretboard">
      <rect className="neck" x={NECK_LEFT} y={TOP_PADDING} width={NECK_LENGTH} height={neckHeight} />
      {spans.map((span) => (
        <Inlays key={span.fret} span={span} top={TOP_PADDING} height={neckHeight} />
      ))}
      <rect className="nut" x={NECK_LEFT - NUT_WIDTH} y={TOP_PADDING} width={NUT_WIDTH} height={neckHeight} />
      {spans.map((span) => (
        <line key={span.fret} className="fret-wire" x1={span.end} x2={span.end} y1={TOP_PADDING} y2={neckBottom} />
      ))}
      {spans.map((span) => (
        <text key={span.fret} className="fret-number" x={(span.start + span.end) / 2} y={neckBottom + 20}>
          {span.fret}
        </text>
      ))}
      {strings.map(({ open, string, y }) => (
        <g key={string}>
          <text className="string-label" x={LABEL_WIDTH - 10} y={y}>
            {noteName(open, accidental)}
          </text>
          <line
            className="string-line"
            x1={LABEL_WIDTH}
            x2={VIEW_WIDTH - RIGHT_PADDING}
            y1={y}
            y2={y}
            strokeWidth={stringThickness(open)}
          />
          {hasShape && voicing[string] == null && (
            <text className="muted-mark" x={(openSpan.start + openSpan.end) / 2} y={y}>
              ×
            </text>
          )}
        </g>
      ))}
      {strings.flatMap(({ string, y }) =>
        [openSpan, ...spans].map((span) => {
          const position = { string, fret: span.fret }
          return (
            <FretCell
              key={`${string}-${span.fret}`}
              span={span}
              y={y}
              stringNumber={stringCount - string}
              note={noteAt(board, position)}
              accidental={accidental}
              selected={voicing[string] === span.fret}
              showNote={showAllNotes}
              onToggle={() => onToggle(position)}
            />
          )
        }),
      )}
    </svg>
  )
}

interface InlaysProps {
  span: FretSpan
  top: number
  height: number
}

function Inlays({ span, top, height }: InlaysProps) {
  const count = inlayCount(span.fret)
  const x = (span.start + span.end) / 2
  const ys = count === 2 ? [top + height * 0.25, top + height * 0.75] : count === 1 ? [top + height / 2] : []
  return (
    <>
      {ys.map((y) => (
        <circle key={y} className="inlay" cx={x} cy={y} r={INLAY_RADIUS} />
      ))}
    </>
  )
}

interface FretCellProps {
  span: FretSpan
  y: number
  stringNumber: number
  note: number
  accidental: Accidental
  selected: boolean
  showNote: boolean
  onToggle: () => void
}

function FretCell({ span, y, stringNumber, note, accidental, selected, showNote, onToggle }: FretCellProps) {
  const x = (span.start + span.end) / 2
  const place = span.fret === 0 ? 'open' : `fret ${span.fret}`
  const markerClass = selected ? 'marker' : showNote ? 'marker ghost' : 'marker ghost hover-only'

  function handleKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onToggle()
    }
  }

  return (
    <g
      className="cell"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`String ${stringNumber}, ${place}, ${noteName(note, accidental)}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
    >
      <rect
        className="cell-hit"
        x={span.start}
        y={y - STRING_GAP / 2}
        width={span.end - span.start}
        height={STRING_GAP}
      />
      <g className={markerClass}>
        <circle cx={x} cy={y} r={MARKER_RADIUS} />
        <text x={x} y={y}>
          {pitchClassName(pitchClassOf(note), accidental)}
        </text>
      </g>
    </g>
  )
}
