'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_W = 280
const GRID_H = 180
const STEP = 2

const ROCKS = [
  { x: 60,  y: 35,  rx: 12, ry: 7  },
  { x: 180, y: 70,  rx: 9,  ry: 5  },
  { x: 100, y: 130, rx: 14, ry: 8  },
  { x: 220, y: 140, rx: 10, ry: 6  },
  { x: 40,  y: 110, rx: 7,  ry: 4  },
  { x: 240, y: 45,  rx: 11, ry: 6  },
  { x: 150, y: 90,  rx: 6,  ry: 3  },
]

export default function RoverKit({ onInteractionEnd }) {
  const [pos, setPos]           = useState({ x: GRID_W / 2, y: GRID_H / 2 })
  const [heading, setHeading]   = useState(0)
  const [trail, setTrail]       = useState([])
  const [wheels, setWheels]     = useState(0)
  const keys                    = useRef({})
  const animRef                 = useRef(null)
  const interacted              = useRef(false)
  const lastMove                = useRef(null)

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const tick = useCallback(() => {
    const up    = keys.current['w'] || keys.current['arrowup']
    const down  = keys.current['s'] || keys.current['arrowdown']
    const left  = keys.current['a'] || keys.current['arrowleft']
    const right = keys.current['d'] || keys.current['arrowright']

    let dx = 0, dy = 0
    if (up)    dy = -STEP
    if (down)  dy =  STEP
    if (left)  dx = -STEP
    if (right) dx =  STEP

    if (dx !== 0 || dy !== 0) {
      interacted.current = true
      lastMove.current = Date.now()
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      setHeading(angle)
      setWheels(w => w + 1)
      setPos(prev => {
        const nx = clamp(prev.x + dx, 20, GRID_W - 20)
        const ny = clamp(prev.y + dy, 20, GRID_H - 20)
        setTrail(t => [...t.slice(-20), { x: prev.x, y: prev.y, id: Date.now() + Math.random() }])
        return { x: nx, y: ny }
      })
    } else if (interacted.current && lastMove.current && Date.now() - lastMove.current > 600) {
      onInteractionEnd()
      interacted.current = false
      lastMove.current = null
    }

    animRef.current = requestAnimationFrame(tick)
  }, [onInteractionEnd])

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true; e.preventDefault() }
    const up   = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    animRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      cancelAnimationFrame(animRef.current)
    }
  }, [tick])

  const wheelOffset = (wheels % 8) * (Math.PI / 4)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-3 select-none">

      <svg
        width="100%"
        viewBox={`0 0 ${GRID_W} ${GRID_H}`}
        className="border border-border"
        style={{ background: '#0D1117' }}
      >
        {/* Ground texture */}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`h${i}`}
            x1={0} y1={(i / 18) * GRID_H}
            x2={GRID_W} y2={(i / 18) * GRID_H}
            stroke="#161B22" strokeWidth="1"
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`}
            x1={(i / 12) * GRID_W} y1={0}
            x2={(i / 12) * GRID_W} y2={GRID_H}
            stroke="#161B22" strokeWidth="0.5" opacity="0.5"
          />
        ))}

        {/* Rocks */}
        {ROCKS.map((r, i) => (
          <g key={i}>
            <ellipse cx={r.x + 2} cy={r.y + 3} rx={r.rx} ry={r.ry} fill="#0D1117" opacity="0.5" />
            <ellipse cx={r.x} cy={r.y} rx={r.rx} ry={r.ry} fill="#1C2128" stroke="#30363D" strokeWidth="0.5" />
            <ellipse cx={r.x - 3} cy={r.y - 2} rx={r.rx * 0.4} ry={r.ry * 0.4} fill="#30363D" opacity="0.5" />
          </g>
        ))}

        {/* Wheel tracks */}
        {trail.length > 1 && trail.map((p, i) => {
          if (i === 0) return null
          return (
            <line key={p.id}
              x1={trail[i-1].x} y1={trail[i-1].y}
              x2={p.x} y2={p.y}
              stroke="#E3B341"
              strokeWidth="1.5"
              opacity={0.06 + 0.04 * (i / trail.length)}
              strokeDasharray="2 3"
            />
          )
        })}

        {/* Rover body — CSS 3D via SVG transforms */}
        <g transform={`translate(${pos.x}, ${pos.y}) rotate(${heading + 90})`}>

          {/* Shadow */}
          <ellipse cx={2} cy={4} rx={18} ry={8} fill="#000" opacity="0.4" />

          {/* Main body — top face (3D box effect) */}
          <rect x={-12} y={-18} width={24} height={20}
            fill="#1C2128" stroke="#E3B341" strokeWidth="1" rx="1"
          />
          {/* Body side face (3D depth) */}
          <polygon
            points="-12,-18 -16,-14 -16,6 -12,2"
            fill="#161B22" stroke="#30363D" strokeWidth="0.5"
          />
          <polygon
            points="12,-18 16,-14 16,6 12,2"
            fill="#30363D" stroke="#30363D" strokeWidth="0.5"
          />

          {/* Solar panel left */}
          <rect x={-26} y={-14} width={12} height={8}
            fill="#0D1117" stroke="#E3B341" strokeWidth="0.8"
          />
          <line x1={-26} y1={-10} x2={-14} y2={-10} stroke="#30363D" strokeWidth="0.5" />
          <line x1={-22} y1={-14} x2={-22} y2={-6}  stroke="#30363D" strokeWidth="0.5" />
          <line x1={-18} y1={-14} x2={-18} y2={-6}  stroke="#30363D" strokeWidth="0.5" />

          {/* Solar panel right */}
          <rect x={14}  y={-14} width={12} height={8}
            fill="#0D1117" stroke="#E3B341" strokeWidth="0.8"
          />
          <line x1={14}  y1={-10} x2={26}  y2={-10} stroke="#30363D" strokeWidth="0.5" />
          <line x1={18}  y1={-14} x2={18}  y2={-6}  stroke="#30363D" strokeWidth="0.5" />
          <line x1={22}  y1={-14} x2={22}  y2={-6}  stroke="#30363D" strokeWidth="0.5" />

          {/* Mast / antenna */}
          <line x1={0} y1={-18} x2={0} y2={-26} stroke="#E3B341" strokeWidth="1" />
          <circle cx={0} cy={-27} r={2} fill="#E3B341" />

          {/* Camera eye */}
          <rect x={-4} y={-17} width={8} height={5}
            fill="#0D1117" stroke="#E3B341" strokeWidth="0.5"
          />
          <circle cx={0} cy={-15} r={2} fill="#E3B341" opacity="0.8" />

          {/* Wheels — 6 wheels with rotation animation */}
          {[
            { wx: -14, wy: -10 },
            { wx: -14, wy: -2  },
            { wx: -14, wy:  6  },
            { wx:  14, wy: -10 },
            { wx:  14, wy: -2  },
            { wx:  14, wy:  6  },
          ].map((w, i) => (
            <g key={i} transform={`translate(${w.wx}, ${w.wy})`}>
              <ellipse cx={0} cy={0} rx={4} ry={5}
                fill="#161B22" stroke="#E3B341" strokeWidth="0.8"
              />
              {/* Wheel spokes */}
              {[0, 1, 2].map(s => {
                const a = wheelOffset + (s * Math.PI / 3) * (i < 3 ? 1 : -1)
                return (
                  <line key={s}
                    x1={Math.cos(a) * 3} y1={Math.sin(a) * 4}
                    x2={-Math.cos(a) * 3} y2={-Math.sin(a) * 4}
                    stroke="#E3B341" strokeWidth="0.5" opacity="0.6"
                  />
                )
              })}
            </g>
          ))}

        </g>
      </svg>

      {/* WASD controls */}
      <div className="flex flex-col items-center gap-1">
        <kbd className="font-mono text-xs text-dim border border-border px-2.5 py-0.5">W</kbd>
        <div className="flex gap-1">
          <kbd className="font-mono text-xs text-dim border border-border px-2.5 py-0.5">A</kbd>
          <kbd className="font-mono text-xs text-dim border border-border px-2.5 py-0.5">S</kbd>
          <kbd className="font-mono text-xs text-dim border border-border px-2.5 py-0.5">D</kbd>
        </div>
      </div>

      <span className="font-mono text-xs text-dim">wasd to drive · mars surface</span>

    </div>
  )
}