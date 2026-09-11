import { describe, expect, it } from 'vitest'
import { TUNINGS, type Tuning } from '../fretboard/tunings.ts'
import { emptyVoicing } from '../fretboard/voicing.ts'
import { initialState, reducer } from './state.ts'

function preset(id: string): Tuning {
  const found = TUNINGS.find((candidate) => candidate.id === id)
  if (!found) throw new Error(`No preset ${id}`)
  return found
}

const withCOnFifthString = reducer(initialState, { type: 'toggleFret', position: { string: 1, fret: 3 } })

describe('reducer', () => {
  it('starts on standard tuning with nothing placed', () => {
    expect(initialState.board.tuning).toEqual([40, 45, 50, 55, 59, 64])
    expect(initialState.voicing).toEqual(emptyVoicing(6))
  })

  it('keeps the shape when switching to a tuning with the same string count', () => {
    const dropD = reducer(withCOnFifthString, { type: 'applyTuning', notes: preset('drop-d').notes })
    expect(dropD.board.tuning[0]).toBe(38)
    expect(dropD.voicing).toEqual(withCOnFifthString.voicing)
  })

  it('clears the shape when the string count changes', () => {
    const bass = reducer(withCOnFifthString, { type: 'applyTuning', notes: preset('bass').notes })
    expect(bass.voicing).toEqual(emptyVoicing(4))
  })

  it('shifts a string by semitones and ignores shifts outside the note range', () => {
    expect(reducer(initialState, { type: 'shiftString', string: 0, semitones: -2 }).board.tuning[0]).toBe(38)
    expect(reducer(initialState, { type: 'shiftString', string: 0, semitones: -41 })).toBe(initialState)
    expect(reducer(initialState, { type: 'shiftString', string: 9, semitones: 1 })).toBe(initialState)
  })

  it('keeps the shape aligned when strings are added and removed', () => {
    const sevenStrings = reducer(withCOnFifthString, { type: 'addString', edge: 'low' })
    expect(sevenStrings.board.tuning[0]).toBe(35)
    expect(sevenStrings.voicing).toEqual([null, null, 3, null, null, null, null])
    const backToSix = reducer(sevenStrings, { type: 'removeString', string: 0 })
    expect(backToSix).toEqual(withCOnFifthString)
  })

  it('ignores removing the only string', () => {
    const single = reducer(initialState, { type: 'applyTuning', notes: [40] })
    expect(reducer(single, { type: 'removeString', string: 0 })).toBe(single)
  })

  it('lifts frets beyond a reduced fret count and ignores invalid counts', () => {
    const high = reducer(initialState, { type: 'toggleFret', position: { string: 0, fret: 12 } })
    expect(reducer(high, { type: 'setFretCount', fretCount: 11 }).voicing[0]).toBeNull()
    expect(reducer(high, { type: 'setFretCount', fretCount: 0 })).toBe(high)
  })

  it('ignores positions off the board', () => {
    expect(reducer(initialState, { type: 'toggleFret', position: { string: 0, fret: 16 } })).toBe(initialState)
  })

  it('clears the shape and changes display settings', () => {
    expect(reducer(withCOnFifthString, { type: 'clearVoicing' }).voicing).toEqual(emptyVoicing(6))
    expect(reducer(initialState, { type: 'setAccidental', accidental: 'flat' }).accidental).toBe('flat')
    expect(reducer(initialState, { type: 'setShowAllNotes', showAllNotes: true }).showAllNotes).toBe(true)
  })
})
