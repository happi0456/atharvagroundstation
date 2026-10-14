'use client'

import { useState, useRef } from 'react'

const MORSE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....',
  I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.',
  Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-',
  Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
}

function toMorse(text) {
  return text
    .toUpperCase()
    .split('')
    .map(c => c === ' ' ? '/' : (MORSE[c] || '?'))
    .join(' ')
}

export default function MorseKit({ onInteractionEnd }) {
  const [input, setInput] = useState('')
  const [flashing, setFlashing] = useState(false)
  const [flashIndex, setFlashIndex] = useState(-1)
  const timeouts = useRef([])
  const interacted = useRef(false)

  const morse = toMorse(input || 'ASGS')
  const symbols = morse.split('')

  const clearAll = () => timeouts.current.forEach(clearTimeout)

  const flash = () => {
    if (!input) return
    clearAll()
    interacted.current = true
    let t = 0
    const unit = 150
    symbols.forEach((sym, i) => {
      const on = timeouts.current[timeouts.current.length] = setTimeout(() => {
        setFlashing(true)
        setFlashIndex(i)
      }, t)
      t += sym === '.' ? unit : sym === '-' ? unit * 3 : 0
      const off = timeouts.current[timeouts.current.length] = setTimeout(() => {
        setFlashing(false)
        setFlashIndex(-1)
      }, t)
      t += unit
      timeouts.current.push(on, off)
    })
    timeouts.current.push(
      setTimeout(() => {
        if (interacted.current) {
          onInteractionEnd()
          interacted.current = false
        }
      }, t + 500)
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-6 select-none">

      {/* Flash indicator */}
      <div className={`w-16 h-16 rounded-full border-2 transition-all duration-75 ${
        flashing ? 'bg-gold border-gold' : 'bg-canvas border-border'
      }`} />

      {/* Morse output */}
      <div className="w-full border border-border bg-canvas p-3 min-h-12 flex flex-wrap gap-1 items-center">
        {symbols.map((sym, i) => (
          <span
            key={i}
            className={`font-mono text-sm transition-colors duration-75 ${
              i === flashIndex ? 'text-gold' : 'text-muted'
            }`}
          >
            {sym}
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        maxLength={20}
        placeholder="Type anything..."
        value={input}
        onChange={e => {
          setInput(e.target.value)
          interacted.current = true
        }}
        onBlur={() => {
          if (interacted.current) {
            onInteractionEnd()
            interacted.current = false
          }
        }}
        className="w-full bg-canvas border border-border text-ink font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors duration-200 placeholder:text-dim"
      />

      <button
        onClick={flash}
        className="font-mono text-xs text-canvas bg-gold px-4 py-2 hover:bg-gold-muted transition-colors duration-200 disabled:opacity-40"
        disabled={!input}
      >
        Flash it
      </button>

      <span className="font-mono text-xs text-dim">type a word · watch it flash in morse</span>
    </div>
  )
}