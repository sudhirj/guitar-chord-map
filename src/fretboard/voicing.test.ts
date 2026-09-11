import { describe, expect, it } from 'vitest'
import { createFretboard } from './fretboard.ts'
import { STANDARD } from './tunings.ts'
import {
  addStringToVoicing,
  emptyVoicing,
  formatVoicing,
  limitVoicingToFrets,
  removeStringFromVoicing,
  toggleFret,
  type Voicing,
  voicingNotes,
  voicingPitchClasses,
  voicingPositions,
} from './voicing.ts'

const board = createFretboard(STANDARD.notes, 15)
const cMajor: Voicing = [null, 3, 2, 0, 1, 0]

describe('toggleFret', () => {
  it('places a fret, moves it along the string, and lifts it', () => {
    const placed = toggleFret(emptyVoicing(6), { string: 1, fret: 3 })
    expect(placed).toEqual([null, 3, null, null, null, null])
    expect(toggleFret(placed, { string: 1, fret: 5 })).toEqual([null, 5, null, null, null, null])
    expect(toggleFret(placed, { string: 1, fret: 3 })).toEqual(emptyVoicing(6))
  })
})

describe('reading a voicing', () => {
  it('lists the fretted positions from the lowest string up', () => {
    expect(voicingPositions([null, 3, null, 0])).toEqual([
      { string: 1, fret: 3 },
      { string: 3, fret: 0 },
    ])
  })

  it('lists the sounding notes', () => {
    expect(voicingNotes(board, cMajor)).toEqual([48, 52, 55, 60, 64])
  })

  it('collects distinct pitch classes in order of first appearance', () => {
    expect(voicingPitchClasses(board, cMajor)).toEqual([0, 4, 7])
  })
})

describe('formatVoicing', () => {
  it('writes single-digit shapes compactly', () => {
    expect(formatVoicing(cMajor)).toBe('x32010')
  })

  it('separates frets once any reaches double digits', () => {
    expect(formatVoicing([null, 10, 12, 12, 11, 10])).toBe('x-10-12-12-11-10')
  })
})

describe('keeping a voicing aligned with its fretboard', () => {
  it('adds a muted string on either edge', () => {
    expect(addStringToVoicing(cMajor, 'low')).toEqual([null, null, 3, 2, 0, 1, 0])
    expect(addStringToVoicing(cMajor, 'high')).toEqual([null, 3, 2, 0, 1, 0, null])
  })

  it('drops a removed string', () => {
    expect(removeStringFromVoicing(cMajor, 1)).toEqual([null, 2, 0, 1, 0])
  })

  it('lifts frets beyond a reduced fret count', () => {
    expect(limitVoicingToFrets([null, 10, 12, 12, 11, 10], 11)).toEqual([null, 10, null, null, 11, 10])
  })
})
