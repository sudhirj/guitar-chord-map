import { useReducer } from 'react'
import { initialState, reducer } from './app/state.ts'
import { ChordSummary } from './ui/ChordSummary.tsx'
import { Fretboard } from './ui/Fretboard.tsx'
import { TuningEditor } from './ui/TuningEditor.tsx'

function App() {
  const [{ board, voicing, accidental, showAllNotes }, dispatch] = useReducer(reducer, initialState)

  return (
    <main className="app">
      <header className="app-header">
        <h1>Guitar Chord Map</h1>
        <p>Set the tuning, then place notes on the fretboard.</p>
      </header>
      <TuningEditor board={board} accidental={accidental} showAllNotes={showAllNotes} dispatch={dispatch} />
      <section className="panel fretboard-panel">
        <div className="fretboard-scroll">
          <Fretboard
            board={board}
            voicing={voicing}
            accidental={accidental}
            showAllNotes={showAllNotes}
            onToggle={(position) => dispatch({ type: 'toggleFret', position })}
          />
        </div>
      </section>
      <ChordSummary
        board={board}
        voicing={voicing}
        accidental={accidental}
        onClear={() => dispatch({ type: 'clearVoicing' })}
      />
    </main>
  )
}

export default App
