'use client'

import { useState, useRef, useEffect } from 'react'

const MORSE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....',
  I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.',
  Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-',
  Y:'-.--', Z:'--..',
}

// Tree node positions matching the PCB layout
// Each node: { id, x, y, letter, dot (child id), dash (child id) }
const NODES = [
  { id: 'root', x: 150, y: 20,  letter: null },
  { id: 'E',    x: 90,  y: 60,  letter: 'E'  },
  { id: 'T',    x: 210, y: 60,  letter: 'T'  },
  { id: 'I',    x: 55,  y: 105, letter: 'I'  },
  { id: 'A',    x: 125, y: 105, letter: 'A'  },
  { id: 'N',    x: 195, y: 105, letter: 'N'  },
  { id: 'M',    x: 265, y: 105, letter: 'M'  },
  { id: 'S',    x: 35,  y: 150, letter: 'S'  },
  { id: 'U',    x: 75,  y: 150, letter: 'U'  },
  { id: 'R',    x: 115, y: 150, letter: 'R'  },
  { id: 'W',    x: 155, y: 150, letter: 'W'  },
  { id: 'D',    x: 195, y: 150, letter: 'D'  },
  { id: 'K',    x: 235, y: 150, letter: 'K'  },
  { id: 'G',    x: 265, y: 150, letter: 'G'  },
  { id: 'O',    x: 295, y: 150, letter: 'O'  },
  { id: 'H',    x: 20,  y: 195, letter: 'H'  },
  { id: 'V',    x: 50,  y: 195, letter: 'V'  },
  { id: 'F',    x: 80,  y: 195, letter: 'F'  },
  { id: 'U2',   x: 110, y: 195, letter: null },
  { id: 'L',    x: 140, y: 195, letter: 'L'  },
  { id: 'P',    x: 170, y: 195, letter: 'P'  },
  { id: 'J',    x: 200, y: 195, letter: 'J'  },
  { id: 'B',    x: 230, y: 195, letter: 'B'  },
  { id: 'X',    x: 255, y: 195, letter: 'X'  },
  { id: 'C',    x: 275, y: 195, letter: 'C'  },
  { id: 'Y',    x: 295, y: 195, letter: 'Y'  },
  { id: 'Z',    x: 265, y: 195, letter: 'Z'  },
  { id: 'Q',    x: 295, y: 195, letter: 'Q'  },
]

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

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]))

function getPath(letter) {
  const code = MORSE[letter.toUpperCase()]
  if (!code) return []
  const path = ['root']
  let current = 'root'
  for (const sym of code) {
    const next = sym === '.' ? TREE[current]?.dot : TREE[current]?.dash
    if (!next) break
    path.push(next)
    current = next
  }
  return path
}

export default function MorseKit({ onInteractionEnd }) {
  const [input, setInput] = useState('')
  const [activePath, setActivePath] = useState([])
  const [activeLetterIndex, setActiveLetterIndex] = useState(-1)
  const [currentLetter, setCurrentLetter] = useState('')
  const timers = useRef([])
  const interacted = useRef(false)

  const clearTimers = () => timers.current.forEach(clearTimeout)

  const animateWord = (word) => {
    clearTimers()
    const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('')
    let delay = 0
    letters.forEach((letter, i) => {
      const path = getPath(letter)
      const t = setTimeout(() => {
        setCurrentLetter(letter)
        setActiveLetterIndex(i)
        setActivePath(path)
      }, delay)
      timers.current.push(t)
      delay += 800 + path.length * 200
    })
    const endT = setTimeout(() => {
      setActivePath([])
      setActiveLetterIndex(-1)
      setCurrentLetter('')
      if (interacted.current) {
        onInteractionEnd()
        interacted.current = false
      }
    }, delay + 400)
    timers.current.push(endT)
  }

  useEffect(() => () => clearTimers(), [])

  const edges = []
  NODES.forEach(node => {
    const children = TREE[node.id]
    if (!children) return
    if (children.dot) {
      const child = NODE_MAP[children.dot]
      if (child) edges.push({ from: node, to: child, type: 'dot', id: `${node.id}-${children.dot}` })
    }
    if (children.dash) {
      const child = NODE_MAP[children.dash]
      if (child) edges.push({ from: node, to: child, type: 'dash', id: `${node.id}-${children.dash}` })
    }
  })

  const isActive = (nodeId) => activePath.includes(nodeId)
  const isEdgeActive = (fromId, toId) => {
    const fi = activePath.indexOf(fromId)
    const ti = activePath.indexOf(toId)
    return fi !== -1 && ti === fi + 1
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 gap-2 select-none">

      {/* Current letter display */}
      <div className="w-full flex items-center justify-between border border-border bg-surface px-3 py-1.5">
        <span className="font-mono text-xs text-dim">
          {input ? input.toUpperCase() : 'type a word'}
        </span>
        <span className="font-mono text-lg text-gold font-bold">
          {currentLetter || '·'}
        </span>
        <span className="font-mono text-xs text-gold tracking-widest">
          {currentLetter ? MORSE[currentLetter] : ''}
        </span>
      </div>

      {/* SVG Tree */}
      <svg
        viewBox="0 0 320 220"
        className="w-full flex-1"
        style={{ background: '#0D1117' }}
      >
        {/* Edges */}
        {edges.map(edge => {
          const active = isEdgeActive(edge.from.id, edge.to.id)
          return (
            <line
              key={edge.id}
              x1={edge.from.x} y1={edge.from.y}
              x2={edge.to.x}   y2={edge.to.y}
              stroke={active ? '#E3B341' : '#30363D'}
              strokeWidth={active ? 2 : 1}
              strokeDasharray={edge.type === 'dot' ? '3 2' : 'none'}
              style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map(node => {
          if (!node.letter) return null
          const active = isActive(node.id)
          const isEnd = activePath[activePath.length - 1] === node.id
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={isEnd ? 9 : 6}
                fill={isEnd ? '#E3B341' : active ? '#B8912A' : '#161B22'}
                stroke={active ? '#E3B341' : '#30363D'}
                strokeWidth={active ? 1.5 : 1}
                style={{ transition: 'all 0.2s' }}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle"
                fontSize={isEnd ? 7 : 6}
                fill={isEnd ? '#0D1117' : active ? '#E3B341' : '#7D8590'}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                style={{ transition: 'all 0.2s' }}
              >
                {node.letter}
              </text>
            </g>
          )
        })}

        {/* Root dot */}
        <circle cx={150} cy={20} r={4} fill="#E3B341" opacity="0.4" />

        {/* Dot = dashed / Dash = solid legend */}
        <text x={5} y={215} fontSize={6} fill="#484F58" fontFamily="JetBrains Mono, monospace">· · · dot</text>
        <text x={60} y={215} fontSize={6} fill="#484F58" fontFamily="JetBrains Mono, monospace">— dash</text>
      </svg>

      {/* Input */}
      <div className="w-full flex gap-2">
        <input
          type="text"
          maxLength={8}
          placeholder="type a word..."
          value={input}
          onChange={e => setInput(e.target.value)}
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