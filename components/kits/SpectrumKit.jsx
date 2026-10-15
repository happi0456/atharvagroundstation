'use client'

import { useState, useRef, useEffect } from 'react'

const BANDS = [
  { name: 'VHF',    min: 144,   max: 146   },
  { name: 'UHF',    min: 435,   max: 438   },
  { name: 'L-Band', min: 1260,  max: 1270  },
  { name: 'S-Band', min: 2400,  max: 2450  },
  { name: 'Ka',     min: 25500, max: 27000 },
]

function generateSpectrum(knob, points = 60) {
  return Array.from({ length: points }, (_, i) => {
    const base = 15 + Math.random() * 10
    const peak1 = 65 * Math.exp(-Math.pow((i - (knob * points + 10)) / 4, 2))
    const peak2 = 30 * Math.exp(-Math.pow((i - (knob * points + 22)) / 6, 2))
    return Math.min(85, base + peak1 + peak2)
  })
}

export default function SpectrumKit({ onInteractionEnd }) {
  const [knob, setKnob] = useState(0.3)
  const [isDragging, setIsDragging] = useState(false)
  const [spectrum, setSpectrum] = useState(() => generateSpectrum(0.3))
  const startX = useRef(0)
  const startKnob = useRef(0)
  const interacted = useRef(false)
  const animRef = useRef(null)

  const activeBandIndex = Math.min(Math.floor(knob * BANDS.length), BANDS.length - 1)
  const activeBand = BANDS[activeBandIndex]
  const bandProgress = (knob * BANDS.length) - activeBandIndex
  const freq = (activeBand.min + (activeBand.max - activeBand.min) * bandProgress).toFixed(1)

  useEffect(() => {
    const tick = () => {
      if (!isDragging) setSpectrum(generateSpectrum(knob))
      animRef.current = setTimeout(tick, 120)
    }
    animRef.current = setTimeout(tick, 120)
    return () => clearTimeout(animRef.current)
  }, [knob, isDragging])

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      // left drag = decrease, right drag = increase
      const delta = (clientX - startX.current) / 200
      setKnob(Math.max(0, Math.min(0.99, startKnob.current + delta)))
      interacted.current = true
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
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [isDragging, onInteractionEnd])

  const onKnobDown = (e) => {
    setIsDragging(true)
    startX.current = e.touches ? e.touches[0].clientX : e.clientX
    startKnob.current = knob
  }

  const knobRotation = knob * 270 - 135

  const W = 260
  const H = 75
  const points = spectrum
    .map((v, i) => `${(i / (spectrum.length - 1)) * W},${H - (v / 100) * H}`)
    .join(' ')

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 select-none">

      {/* Screen */}
      <div className="w-full border border-border bg-canvas p-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs text-gold">{activeBand.name}</span>
          <span className="font-mono text-xs text-ink">{freq} MHz</span>
          <span className="font-mono text-xs text-dim">SDR-RX</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(v => (
            <line
              key={v}
              x1={0} y1={H - (v / 100) * H}
              x2={W} y2={H - (v / 100) * H}
              stroke="#30363D" strokeWidth="0.5"
            />
          ))}
          {/* Spectrum fill */}
          <polyline
            points={`0,${H} ${points} ${W},${H}`}
            fill="#E3B341"
            opacity="0.07"
          />
          {/* Spectrum line */}
          <polyline
            points={points}
            fill="none"
            stroke="#E3B341"
            strokeWidth="1.5"
          />
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
          onMouseDown={onKnobDown}
          onTouchStart={onKnobDown}
          className="w-14 h-14 rounded-full border-2 border-border bg-surface flex items-center justify-center cursor-ew-resize hover:border-gold transition-colors duration-200 relative"
          style={{ transform: `rotate(${knobRotation}deg)` }}
        >
          {/* Knob indicator line */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gold rounded-full" />
          {/* Knob center dot */}
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>
        <span className="font-mono text-xs text-dim">drag left/right · sweep band</span>
      </div>

    </div>
  )
}