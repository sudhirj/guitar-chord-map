# Guitar Chord Map

Builds chord shapes for any tuning. A Vite + React single-page app that runs entirely in the browser.

## Status

The fretboard model and its UI: set each string's open note or pick a preset tuning, choose the fret count, and place
notes on the fretboard to see the shape, the notes it sounds, and its pitch classes. Generating chords from criteria
is next.

## Layout

| Path                         | What it is                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/music/notes.ts`         | Notes as MIDI numbers: parsing (`E2`, `F#3`, `B♭3`), pitch classes, sharp and flat spelling                                                |
| `src/fretboard/fretboard.ts` | A fretboard: open-string tuning and fret count, the note at a position, where a pitch class appears, adding, removing and retuning strings |
| `src/fretboard/voicing.ts`   | A chord shape: a fret or a mute per string, and the notes it sounds                                                                        |
| `src/fretboard/tunings.ts`   | Preset tunings                                                                                                                             |
| `src/app/state.ts`           | The app's reducer                                                                                                                          |
| `src/ui/`                    | React components: SVG fretboard, tuning editor, shape summary                                                                              |

`src/music` and `src/fretboard` do not import React.

Strings are indexed from the lowest-sounding side of the neck (index 0 is low E in standard tuning), matching how
tunings and shapes are written (`E A D G B E`, `x32010`). The UI numbers them the way guitarists do, 1 being the
highest.

## Develop

```sh
pnpm install
pnpm dev          # dev server
pnpm test         # vitest
pnpm check        # typecheck, lint, test
pnpm build
```
