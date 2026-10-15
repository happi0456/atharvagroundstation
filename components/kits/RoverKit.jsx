'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_W = 280
const GRID_H = 200
const ROVER_SIZE = 16
const STEP = 8

const ROCKS = [
  { x: 60,  y: 40,  r: 10 },
  { x: 180, y: 80,  r: 7  },
  { x: 100, y: 140, r: 12 },
  { x: 220, y: 150, r: 8  },
  { x: 40,  y: 120, r: 6  },
  { x: 240, y: 50,  r: 9  },
]

export default function RoverKit({ onInteractionEnd }) {
  const [pos, setPos] = useState({ x: GRID_W / 2, y: GRID_H / 2 })
  const [dir, setDir] = useState('up')
  const [dustTrail, setDustTrail] = useState([])
  const keys = useRef({})
  const animRef = useRef(null)
  const interacted = useRef(false)
  const lastInteraction = useRef(null)

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const tick = useCallback(() => {
    let dx = 0, dy = 0
    if (keys.current['w'] || keys.current['arrowup'])    dy = -STEP
    if (keys.current['s'] || keys.current['arrowdown'])  dy =  STEP
    if (keys.current['a'] || keys.current['arrowleft'])  dx = -STEP
    if (keys.current['d'] || keys.current['arrowright']) dx =  STEP

    if (dx !== 0 || dy !== 0) {
      interacted.current = true
      lastInteraction.current = Date.now()
      if      (dy < 0) setDir('up')
      else if (dy > 0) setDir('down')
      else if (dx < 0) setDir('left')
      else if (dx > 0) setDir('right')

      setPos(prev => {
        const nx = clamp(prev.x + dx, ROVER_SIZE, GRID_W - ROVER_SIZE)
        const ny = clamp(prev.y + dy, ROVER_SIZE, GRID_H - ROVER_SIZE)
        setDustTrail(t => [...t.slice(-8), { x: prev.x, y: prev.y, id: Date.now() }])
        return { x: nx, y: ny }
      })
    } else if (interacted.current && lastInteraction.current && Date.now() - lastInteraction.current > 500) {
      onInteractionEnd()
      interacted.current = false
      lastInteraction.current = null
    }

    animRef.current = requestAnimationFrame(tick)
  }, [onInteractionEnd])

  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true }
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

  const roverPoints = {
    up:    `${pos.x},${pos.y - ROVER_SIZE} ${pos.x - 10},${pos.y + 8} ${pos.x + 10},${pos.y + 8}`,
    down:  `${pos.x},${pos.y + ROVER_SIZE} ${pos.x - 10},${pos.y - 8} ${pos.x + 10},${pos.y - 8}`,
    left:  `${pos.x - ROVER_SIZE},${pos.y} ${pos.x + 8},${pos.y - 10} ${pos.x + 8},${pos.y + 10}`,
    right: `${pos.x + ROVER_SIZE},${pos.y} ${pos.x - 8},${pos.y - 10} ${pos.x - 8},${pos.y + 10}`,
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none p-4">

      <svg
        width="100%"
        viewBox={`0 0 ${GRID_W} ${GRID_H}`}
        className="border border-border bg-canvas"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Mars surface texture lines */}
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={i}
            x1={0} y1={(i / 10) * GRID_H}
            x2={GRID_W} y2={(i / 10) * GRID_H}
            stroke="#1a1f26"
            strokeWidth="1"
          />
        ))}

        {/* Rocks */}
        {ROCKS.map((rock, i) => (
          <ellipse
            key={i}
            cx={rock.x} cy={rock.y}
            rx={rock.r} ry={rock.r * 0.6}
            fill="#30363D"
            stroke="#484F58"
            strokeWidth="0.5"
          />
        ))}

        {/* Dust trail */}
        {dustTrail.map((d, i) => (
          <circle
            key={d.id}
            cx={d.x} cy={d.y}
            r={3 * (i / dustTrail.length)}
            fill="#E3B341"
            opacity={0.15 * (i / dustTrail.length)}
          />
        ))}

        {/* Rover */}
        <polygon
          points={roverPoints[dir]}
          fill="#E3B341"
          stroke="#B8912A"
          strokeWidth="1"
        />
        <circle cx={pos.x} cy={pos.y} r={3} fill="#0D1117" />
      </svg>

      {/* WASD hint */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1">
          <kbd className="font-mono text-xs text-dim border border-border px-2 py-0.5">W</kbd>
        </div>
        <div className="flex gap-1">
          <kbd className="font-mono text-xs text-dim border border-border px-2 py-0.5">A</kbd>
          <kbd className="font-mono text-xs text-dim border border-border px-2 py-0.5">S</kbd>
          <kbd className="font-mono text-xs text-dim border border-border px-2 py-0.5">D</kbd>
        </div>
      </div>

      <span className="font-mono text-xs text-dim">wasd to drive · martian surface</span>
    </div>
  )
}