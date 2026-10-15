'use client'

import { useState, useRef, useEffect } from 'react'

const MORSE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....',
  I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.',
  Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-',
  Y:'-.--', Z:'--..',
}

const TREE = {
  root: { dot: 'E',  dash: 'T'  },
  E:    { dot: 'I',  dash: 'A'  },
  T:    { dot: 'N',  dash: 'M'  },
  I:    { dot: 'S',  dash: 'U'  },
  A:    { dot: 'R',  dash: 'W'  },
  N:    { dot: 'D',  dash: 'K'  },
  M:    { dot: 'G',  dash: 'O'  },
  S:    { dot: 'H',  dash: 'V'  },
  U:    { dot: 'F',  dash: 'U2' },
  R:    { dot: 'L',  dash: 'P'  },
  W:    { dot: 'P',  dash: 'J'  },
  D:    { dot: 'B',  dash: 'X'  },
  K:    { dot: 'C',  dash: 'Y'  },
  G:    { dot: 'Z',  dash: 'Q'  },
}

// Centered tree layout — root at top center, branches spread evenly
const NODES = [
  { id: 'root', x: 160, y: 28,  letter: null },
  // Level 1
  { id: 'E',    x: 90,  y: 58,  letter: 'E'  },
  { id: 'T',    x: 230, y: 58,  letter: 'T'  },
  // Level 2
  { id: 'I',    x: 52,  y: 95,  letter: 'I'  },
  { id: 'A',    x: 110, y: 95,  letter: 'A'  },
  { id: 'N',    x: 200, y: 95,  letter: 'N'  },
  { id: 'M',    x: 268, y: 95,  letter: 'M'  },
  // Level 3
  { id: 'S',    x: 22,  y: 138, letter: 'S'  },
  { id: 'U',    x: 60,  y: 138, letter: 'U'  },
  { id: 'R',    x: 98,  y: 138, letter: 'R'  },
  { id: 'W',    x: 136, y: 138, letter: 'W'  },
  { id: 'D',    x: 174, y: 138, letter: 'D'  },
  { id: 'K',    x: 212, y: 138, letter: 'K'  },
  { id: 'G',    x: 250, y: 138, letter: 'G'  },
  { id: 'O',    x: 288, y: 138, letter: 'O'  },
  // Level 4
  { id: 'H',    x: 10,  y: 178, letter: 'H'  },
  { id: 'V',    x: 30,  y: 178, letter: 'V'  },
  { id: 'F',    x: 50,  y: 178, letter: 'F'  },
  { id: 'U2',   x: 70,  y: 178, letter: null },
  { id: 'L',    x: 90,  y: 178, letter: 'L'  },
  { id: 'P',    x: 110, y: 178, letter: 'P'  },
  { id: 'J',    x: 130, y: 178, letter: 'J'  },
  { id: 'B2',   x: 155, y: 178, letter: null },
  { id: 'X',    x: 175, y: 178, letter: 'X'  },
  { id: 'C',    x: 195, y: 178, letter: 'C'  },
  { id: 'Y',    x: 215, y: 178, letter: 'Y'  },
  { id: 'Z',    x: 240, y: 178, letter: 'Z'  },
  { id: 'Q',    x: 260, y: 178, letter: 'Q'  },
  { id: 'B',    x: 150, y: 178, letter: 'B'  },
]

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]))

const EDGES = []
Object.entries(TREE).forEach(([fromId, children]) => {
  const from = NODE_MAP[fromId]
  if (!from) return
  if (children.dot) {
    const to = NODE_MAP[children.dot]
    if (to) EDGES.push({ from, to, type: 'dot', id: `${fromId}-${children.dot}` })
  }
  if (children.dash) {
    const to = NODE_MAP[children.dash]
    if (to) EDGES.push({ from, to, type: 'dash', id: `${fromId}-${children.dash}` })
  }
})

function getPath(letter) {
  const code = MORSE[letter.toUpperCase()]
  if (!code) return { nodes: [], symbols: [] }
  const nodes = ['root']
  const symbols = []
  let current = 'root'
  for (const sym of code) {
    const next = sym === '.' ? TREE[current]?.dot : TREE[current]?.dash
    if (!next) break
    nodes.push(next)
    symbols.push(sym)
    current = next
  }
  return { nodes, symbols }
}

export default function MorseKit({ onInteractionEnd }) {
  const [input, setInput]               = useState('')
  const [activePath, setActivePath]     = useState([])
  const [currentLetter, setCurrentLetter] = useState('')
  const [currentMorse, setCurrentMorse] = useState('')
  const [flashState, setFlashState]     = useState(null) // null | 'dot' | 'dash'
  const timers = useRef([])
  const interacted = useRef(false)

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  useEffect(() => () => clearTimers(), [])

  const schedule = (fn, delay) => {
    const t = setTimeout(fn, delay)
    timers.current.push(t)
    return t
  }

  const animateWord = (word) => {
    clearTimers()
    const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('')
    let delay = 0
    const DOT_DUR  = 250
    const DASH_DUR = 600
    const GAP      = 150
    const LETTER_GAP = 500

    letters.forEach((letter) => {
      const { nodes, symbols } = getPath(letter)
      if (!nodes.length) return

      // Show letter label
      schedule(() => {
        setCurrentLetter(letter)
        setCurrentMorse(MORSE[letter] || '')
        setActivePath([nodes[0]])
        setFlashState(null)
      }, delay)

      // Animate each step in the path
      symbols.forEach((sym, si) => {
        delay += GAP
        const dur = sym === '.' ? DOT_DUR : DASH_DUR

        // Flash the indicator dot
        schedule(() => {
          setFlashState(sym === '.' ? 'dot' : 'dash')
          setActivePath(nodes.slice(0, si + 2))
        }, delay)

        // Turn off flash
        schedule(() => {
          setFlashState(null)
        }, delay + dur)

        delay += dur
      })

      delay += LETTER_GAP
    })

    // End
    schedule(() => {
      setActivePath([])
      setCurrentLetter('')
      setCurrentMorse('')
      setFlashState(null)
      if (interacted.current) {
        onInteractionEnd()
        interacted.current = false
      }
    }, delay + 400)
  }

  const isNodeActive = (id) => activePath.includes(id)
  const isEdgeActive = (fromId, toId) => {
    const fi = activePath.indexOf(fromId)
    const ti = activePath.indexOf(toId)
    return fi !== -1 && ti === fi + 1
  }
  const isEndNode = (id) => activePath[activePath.length - 1] === id

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 gap-2 select-none">

      {/* Flash indicator + letter display */}
      <div className="w-full flex items-center justify-between gap-2">
        {/* Flash dot */}
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full border transition-all"
            style={{
              width:  flashState === 'dash' ? 28 : 12,
              height: 12,
              borderRadius: flashState === 'dash' ? 4 : 999,
              background: flashState ? '#E3B341' : 'transparent',
              borderColor: flashState ? '#E3B341' : '#30363D',
              transition: 'all 0.08s ease',
            }}
          />
          <span className="font-mono text-xs text-dim">
            {flashState === 'dot' ? '·' : flashState === 'dash' ? '—' : ''}
          </span>
        </div>

        {/* Current letter */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg text-gold font-bold leading-none">
            {currentLetter || '·'}
          </span>
          <span className="font-mono text-xs text-muted tracking-widest">
            {currentMorse}
          </span>
        </div>

        {/* Word display */}
        <span className="font-mono text-xs text-dim truncate max-w-20 text-right">
          {input.toUpperCase()}
        </span>
      </div>

      {/* SVG Tree */}
      <svg viewBox="0 0 320 195" className="w-full flex-1" style={{ background: '#0D1117' }}>

        {/* Root marker */}
        <circle
          cx={160} cy={28} r={5}
          fill={activePath.includes('root') ? '#E3B341' : '#30363D'}
          style={{ transition: 'fill 0.15s' }}
        />

        {/* Edges */}
        {EDGES.map(edge => {
          const active = isEdgeActive(edge.from.id, edge.to.id)
          return (
            <line
              key={edge.id}
              x1={edge.from.x} y1={edge.from.y}
              x2={edge.to.x}   y2={edge.to.y}
              stroke={active ? '#E3B341' : '#1C2128'}
              strokeWidth={active ? 1.5 : 1}
              strokeDasharray={edge.type === 'dot' ? '2 2' : 'none'}
              style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map(node => {
          if (!node.letter) return null
          const active  = isNodeActive(node.id)
          const isEnd   = isEndNode(node.id)
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y}
                r={isEnd ? 8 : 5}
                fill={isEnd ? '#E3B341' : active ? '#B8912A' : '#161B22'}
                stroke={active ? '#E3B341' : '#30363D'}
                strokeWidth={active ? 1.5 : 0.8}
                style={{ transition: 'all 0.15s' }}
              />
              <text
                x={node.x} y={node.y + 3.5}
                textAnchor="middle"
                fontSize={isEnd ? 7 : 5.5}
                fill={isEnd ? '#0D1117' : active ? '#E3B341' : '#484F58'}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                style={{ transition: 'all 0.15s' }}
              >
                {node.letter}
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <line x1={6} y1={192} x2={16} y2={192} stroke="#484F58" strokeWidth="1" strokeDasharray="2 2" />
        <text x={19} y={194} fontSize={5} fill="#484F58" fontFamily="JetBrains Mono, monospace">dot</text>
        <line x1={40} y1={192} x2={52} y2={192} stroke="#484F58" strokeWidth="1" />
        <text x={55} y={194} fontSize={5} fill="#484F58" fontFamily="JetBrains Mono, monospace">dash</text>
      </svg>

      {/* Input */}
      <div className="w-full flex gap-2">
        <input
          type="text"
          maxLength={8}
          placeholder="type a word..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input) {
              interacted.current = true
              animateWord(input)
            }
          }}
          className="flex-1 bg-canvas border border-border text-ink font-mono text-xs px-2 py-1.5 outline-none focus:border-gold transition-colors duration-200 placeholder:text-dim"
        />
        <button
          onClick={() => {
            if (!input) return
            interacted.current = true
            animateWord(input)
          }}
          className="font-mono text-xs text-canvas bg-gold px-3 py-1.5 hover:bg-gold-muted transition-colors duration-200"
        >
          decode
        </button>
      </div>

    </div>
  )
}