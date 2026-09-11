import { describe, expect, it } from 'vitest'
import {
  addString,
  canAddString,
  canRemoveString,
  createFretboard,
  MAX_STRINGS,
  noteAt,
  positionsOf,
  removeString,
  retuneString,
  withFretCount,
} from './fretboard.ts'
import { STANDARD } from './tunings.ts'

const standard = createFretboard(STANDARD.notes, 12)

describe('createFretboard', () => {
  it('copies the tuning so later changes to the input do not leak in', () => {
    const tuning = [40, 45]
    const board = createFretboard(tuning, 12)
    tuning[0] = 0
    expect(board.tuning).toEqual([40, 45])
  })

  it('rejects boards without strings, with too many, or with invalid notes or fret counts', () => {
    expect(() => createFretboard([], 12)).toThrow(RangeError)
    expect(() =>
      createFretboard(
        Array.from({ length: MAX_STRINGS + 1 }, () => 40),
        12,
      ),
    ).toThrow(RangeError)
    expect(() => createFretboard([128], 12)).toThrow(RangeError)
    expect(() => createFretboard([40], 0)).toThrow(RangeError)
    expect(() => createFretboard([40], 25)).toThrow(RangeError)
    expect(() => createFretboard([40], 2.5)).toThrow(RangeError)
  })
})

describe('noteAt', () => {
  it('adds the fret to the open string note', () => {
    expect(noteAt(standard, { string: 0, fret: 0 })).toBe(40)
    expect(noteAt(standard, { string: 0, fret: 5 })).toBe(45)
    expect(noteAt(standard, { string: 5, fret: 12 })).toBe(76)
  })

  it('rejects positions off the board', () => {
    expect(() => noteAt(standard, { string: 6, fret: 0 })).toThrow(RangeError)
    expect(() => noteAt(standard, { string: -1, fret: 0 })).toThrow(RangeError)
    expect(() => noteAt(standard, { string: 0, fret: 13 })).toThrow(RangeError)
  })
})

describe('positionsOf', () => {
  it('finds every position of a pitch class', () => {
    expect(positionsOf(createFretboard(STANDARD.notes, 5), 9)).toEqual([
      { string: 0, fret: 5 },
      { string: 1, fret: 0 },
      { string: 3, fret: 2 },
      { string: 5, fret: 5 },
    ])
  })

  it('includes the same pitch class in higher octaves along a string', () => {
    expect(positionsOf(standard, 9).filter((position) => position.string === 1)).toEqual([
      { string: 1, fret: 0 },
      { string: 1, fret: 12 },
    ])
  })
})

describe('changing a fretboard', () => {
  it('retunes one string without touching the others or the original', () => {
    expect(retuneString(standard, 0, 38).tuning).toEqual([38, 45, 50, 55, 59, 64])
    expect(standard.tuning[0]).toBe(40)
    expect(() => retuneString(standard, 0, 128)).toThrow(RangeError)
    expect(() => retuneString(standard, 6, 40)).toThrow(RangeError)
  })

  it('adds strings a perfect fourth beyond either edge', () => {
    expect(addString(standard, 'low').tuning).toEqual([35, 40, 45, 50, 55, 59, 64])
    expect(addString(standard, 'high').tuning).toEqual([40, 45, 50, 55, 59, 64, 69])
  })

  it('does not add strings past the string limit or the note range', () => {
    expect(
      canAddString(
        createFretboard(
          Array.from({ length: MAX_STRINGS }, () => 40),
          12,
        ),
        'high',
      ),
    ).toBe(false)
    expect(canAddString(createFretboard([4], 12), 'low')).toBe(false)
    expect(canAddString(createFretboard([123], 12), 'high')).toBe(false)
    expect(() => addString(createFretboard([4], 12), 'low')).toThrow(RangeError)
  })

  it('removes a string but never the last one', () => {
    expect(removeString(standard, 5).tuning).toEqual([40, 45, 50, 55, 59])
    const single = createFretboard([40], 12)
    expect(canRemoveString(single, 0)).toBe(false)
    expect(() => removeString(single, 0)).toThrow(RangeError)
    expect(canRemoveString(standard, 6)).toBe(false)
  })

  it('changes the fret count', () => {
    expect(withFretCount(standard, 24)).toEqual({ tuning: STANDARD.notes, fretCount: 24 })
    expect(() => withFretCount(standard, 0)).toThrow(RangeError)
  })
})
