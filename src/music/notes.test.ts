import { describe, expect, it } from 'vitest'
import { HIGHEST_NOTE, LOWEST_NOTE, noteName, octaveOf, parseNote, pitchClassName, pitchClassOf } from './notes.ts'

describe('parseNote', () => {
  it('parses natural notes with octaves', () => {
    expect(parseNote('C4')).toBe(60)
    expect(parseNote('E2')).toBe(40)
    expect(parseNote('A4')).toBe(69)
    expect(parseNote(' g3 ')).toBe(55)
  })

  it('parses sharps and flats in ASCII and Unicode', () => {
    expect(parseNote('F#3')).toBe(54)
    expect(parseNote('F♯3')).toBe(54)
    expect(parseNote('Gb3')).toBe(54)
    expect(parseNote('G♭3')).toBe(54)
    expect(parseNote('bb3')).toBe(58)
    expect(parseNote('C##4')).toBe(62)
  })

  it('crosses octave boundaries with accidentals', () => {
    expect(parseNote('B#3')).toBe(60)
    expect(parseNote('Cb4')).toBe(59)
  })

  it('rejects malformed or out of range notes', () => {
    for (const text of ['', 'H2', 'C', '4', 'C#b4', 'C###4', 'C10', 'Cb-1', 'G#9']) {
      expect(parseNote(text)).toBeNull()
    }
  })
})

describe('noteName', () => {
  it('spells with sharps or flats', () => {
    expect(noteName(61, 'sharp')).toBe('C♯4')
    expect(noteName(61, 'flat')).toBe('D♭4')
    expect(noteName(40, 'flat')).toBe('E2')
    expect(noteName(0, 'sharp')).toBe('C-1')
  })

  it('round-trips every note through parseNote', () => {
    for (let midi = LOWEST_NOTE; midi <= HIGHEST_NOTE; midi++) {
      expect(parseNote(noteName(midi, 'sharp'))).toBe(midi)
      expect(parseNote(noteName(midi, 'flat'))).toBe(midi)
    }
  })
})

describe('pitch classes', () => {
  it('reduces notes to their pitch class and octave', () => {
    expect(pitchClassOf(64)).toBe(4)
    expect(pitchClassOf(-1)).toBe(11)
    expect(octaveOf(59)).toBe(3)
    expect(octaveOf(60)).toBe(4)
  })

  it('names pitch classes without an octave', () => {
    expect(pitchClassName(10, 'sharp')).toBe('A♯')
    expect(pitchClassName(10, 'flat')).toBe('B♭')
  })
})
