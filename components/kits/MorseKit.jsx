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

const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]))

export default function MorseKit({ onInteractionEnd }) {
  const [mode, setMode] = useState('type')
  const [input, setInput] = useState('')
  const [sequence, setSequence] = useState('')
  const [decoded, setDecoded] = useState('')
  const [active, setActive] = useState(null)
  const interacted = useRef(false)
  const endTimer = useRef(null)

  const triggerEnd = () => {
    clearTimeout(endTimer.current)
    endTimer.current = setTimeout(() => {
      if (interacted.current) {
        onInteractionEnd()
        interacted.current = false
      }
    }, 2500)
  }

  const toMorse = (text) =>
    text.toUpperCase().split('').map(c => c === ' ' ? '/' : (MORSE[c] || '?')).join(' ')

  const addSymbol = (sym) => {
    interacted.current = true
    const next = sequence ? sequence + sym : sym
    setSequence(next)
    const letter = REVERSE_MORSE[next]
    if (letter) {
      setDecoded(prev => prev + letter)
      setTimeout(() => setSequence(''), 600)
    }
    triggerEnd()
  }

  const clearAll = () => {
    setSequence('')
    setDecoded('')
    setInput('')
  }

  const morse = mode === 'type' ? toMorse(input || '') : ''

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 select-none">

      {/* Mode toggle */}
      <div className="flex w-full border border-border">
        {['type', 'key'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); clearAll() }}
            className={`flex-1 font-mono text-xs py-1.5 transition-colors duration-150 ${
              mode === m ? 'bg-gold text-canvas' : 'text-dim hover:text-ink'
            }`}
          >
            {m === 'type' ? 'Type → Morse' : 'Key → Decode'}
          </button>
        ))}
      </div>

      {mode === 'type' ? (
        <>
          {/* Input */}
          <input
            type="text"
            maxLength={16}
            placeholder="type a word..."
            value={input}
            onChange={e => {
              setInput(e.target.value)
              interacted.current = true
              triggerEnd()
            }}
            className="w-full bg-canvas border border-border text-ink font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors duration-200 placeholder:text-dim"
          />

          {/* Morse output */}
          <div className="w-full border border-border bg-surface p-3 min-h-16 flex flex-wrap gap-1 items-start">
            {input ? morse.split(' ').map((word, wi) => (
              <span key={wi} className="font-mono text-sm text-gold">{word}&nbsp;</span>
            )) : (
              <span className="font-mono text-xs text-dim">morse output appears here</span>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Current sequence */}
          <div className="w-full border border-border bg-surface p-3 flex items-center justify-between">
            <span className="font-mono text-lg text-gold tracking-widest">{sequence || '·'}</span>
            <span className="font-mono text-xs text-dim">
              {REVERSE_MORSE[sequence] ? `→ ${REVERSE_MORSE[sequence]}` : ''}
            </span>
          </div>

          {/* Decoded output */}
          <div className="w-full border border-border bg-canvas p-2 min-h-8 flex items-center">
            <span className="font-mono text-sm text-ink tracking-widest">
              {decoded || <span className="text-dim text-xs">decoded text</span>}
            </span>
          </div>

          {/* Dot / Dash buttons */}
          <div className="flex gap-3 w-full">
            <button
              onPointerDown={() => setActive('dot')}
              onPointerUp={() => { setActive(null); addSymbol('.') }}
              className={`flex-1 py-4 border font-mono text-xl transition-colors duration-75 ${
                active === 'dot' ? 'bg-gold text-canvas border-gold' : 'border-border text-muted hover:border-gold hover:text-gold'
              }`}
            >
              ·
            </button>
            <button
              onPointerDown={() => setActive('dash')}
              onPointerUp={() => { setActive(null); addSymbol('-') }}
              className={`flex-1 py-4 border font-mono text-xl transition-colors duration-75 ${
                active === 'dash' ? 'bg-gold text-canvas border-gold' : 'border-border text-muted hover:border-gold hover:text-gold'
              }`}
            >
              —
            </button>
          </div>

          {/* Space / Clear */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setDecoded(prev => prev + ' '); setSequence(''); interacted.current = true; triggerEnd() }}
              className="flex-1 py-1.5 border border-border font-mono text-xs text-dim hover:text-ink hover:border-muted transition-colors duration-150"
            >
              space
            </button>
            <button
              onClick={clearAll}
              className="flex-1 py-1.5 border border-border font-mono text-xs text-dim hover:text-ink hover:border-muted transition-colors duration-150"
            >
              clear
            </button>
          </div>
        </>
      )}

      <span className="font-mono text-xs text-dim">
        {mode === 'type' ? 'type to encode' : 'tap · and — to decode morse'}
      </span>
    </div>
  )
}