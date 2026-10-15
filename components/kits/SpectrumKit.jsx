'use client'

import { useState, useRef, useEffect } from 'react'

const BANDS = [
  { name: 'VHF',    min: 144,    max: 146    },
  { name: 'UHF',    min: 435,    max: 438    },
  { name: 'L-Band', min: 1260,   max: 1270   },
  { name: 'S-Band', min: 2400,   max: 2450   },
  { name: 'Ka',     min: 25500,  max: 27000  },
]

function generateSpectrum(knobValue, points = 60) {
  return Array.from({ length: points }, (_, i) => {
    const base = 20 + Math.random() * 15
    const peak1 = 60 * Math.exp(-Math.pow((i - (knobValue * points + 10)) / 4, 2))
    const peak2 = 30 * Math.exp(-Math.pow((i - (knobValue * points + 25)) / 6, 2))
    return Math.min(80, base + peak1 + peak2)
  })
}

export default function SpectrumKit({ onInteractionEnd }) {
  const [knob, setKnob] = useState(0.3)
  const [isDragging, setIsDragging] = useState(false)
  const [spectrum, setSpectrum] = useState(() => generateSpectrum(0.3))
  const knobRef = useRef(null)
  const startY = useRef(0)
  const startKnob = useRef(0)
  const interacted = useRef(false)
  const animRef = useRef(null)

  const activeBandIndex = Math.floor(knob * BANDS.length)
  const activeBand = BANDS[Math.min(activeBandIndex, BANDS.length - 1)]
  const freq = (activeBand.min + (activeBand.max - activeBand.min) * (knob * BANDS.length - activeBandIndex)).toFixed(1)

  useEffect(() => {
    const tick = () => {
      if (!isDragging) {
        setSpectrum(generateSpectrum(knob))
      }
      animRef.current = setTimeout(tick, 120)
    }
    animRef.current = setTimeout(tick, 120)
    return () => clearTimeout(animRef.current)
  }, [knob, isDragging])

  const onMouseDown = (e) => {
    setIsDragging(true)
    startY.current = e.clientY
    startKnob.current = knob
    interacted.current = true
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return
      const delta = (startY.current - e.clientY) / 150
      setKnob(Math.max(0, Math.min(0.99, startKnob.current + delta)))
      setSpectrum(generateSpectrum(knob))
    }
    const onUp = () => {
      if (!isDragging) return
      setIsDragging(false)
      if (interacted.current) {
        onInteractionEnd()
        interacted.current = false
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, knob, onInteractionEnd])

  const knobRotation = knob * 270 - 135

  const W = 280
  const H = 80
  const points = spectrum
    .map((v, i) => `${(i / (spectrum.length - 1)) * W},${H - (v / 100) * H}`)
    .join(' ')

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none p-4">

      {/* Screen */}
      <div className="w-full border border-border bg-canvas p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-gold">{activeBand.name}</span>
          <span className="font-mono text-xs text-ink">{freq} MHz</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="#E3B341"
            strokeWidth="1.5"
          />
          <polyline
            points={`0,${H} ${points} ${W},${H}`}
            fill="#E3B341"
            opacity="0.08"
          />
          {[0, 25, 50, 75, 100].map(v => (
            <line
              key={v}
              x1={0} y1={H - (v / 100) * H}
              x2={W} y2={H - (v / 100) * H}
              stroke="#30363D"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Band labels */}
      <div className="flex w-full justify-between px-1">
        {BANDS.map((b, i) => (
          <span
            key={b.name}
            className={`font-mono text-xs transition-colors duration-200 ${
              i === activeBandIndex ? 'text-gold' : 'text-dim'
            }`}
          >
            {b.name}
          </span>
        ))}
      </div>

      {/* Knob */}
      <div className="flex flex-col items-center gap-2">
        <div
          ref={knobRef}
          onMouseDown={onMouseDown}
          className="w-12 h-12 rounded-full border-2 border-border bg-surface flex items-center justify-center cursor-ns-resize hover:border-gold transition-colors duration-200"
          style={{ transform: `rotate(${knobRotation}deg)` }}
        >
          <div className="w-1 h-4 bg-gold rounded-full" style={{ marginTop: '-8px' }} />
        </div>
        <span className="font-mono text-xs text-dim">drag knob · sweep frequency</span>
      </div>

    </div>
  )
}