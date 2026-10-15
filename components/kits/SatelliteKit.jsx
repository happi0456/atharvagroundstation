'use client'

import { useEffect, useRef, useState } from 'react'

const EARTH_RADIUS = 80
const SAT_ORBIT = 120
const CENTER = 150

export default function SatelliteKit({ onInteractionEnd }) {
  const [rotation, setRotation] = useState(0)
  const [satAngle, setSatAngle] = useState(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const animRef = useRef(null)
  const interactedRef = useRef(false)

  useEffect(() => {
    const tick = () => {
      if (!isDragging.current) {
        setRotation(r => (r + 0.3) % 360)
        setSatAngle(a => (a + 0.6) % 360)
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const onMouseDown = (e) => {
    isDragging.current = true
    lastX.current = e.clientX
    interactedRef.current = true
  }

  const onMouseMove = (e) => {
    if (!isDragging.current) return
    const delta = e.clientX - lastX.current
    lastX.current = e.clientX
    setRotation(r => (r + delta * 0.5) % 360)
    setSatAngle(a => (a + delta * 0.8) % 360)
  }

  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (interactedRef.current) {
      onInteractionEnd()
      interactedRef.current = false
    }
  }

  const onTouchStart = (e) => {
    isDragging.current = true
    lastX.current = e.touches[0].clientX
    interactedRef.current = true
  }

  const onTouchMove = (e) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientX - lastX.current
    lastX.current = e.touches[0].clientX
    setRotation(r => (r + delta * 0.5) % 360)
    setSatAngle(a => (a + delta * 0.8) % 360)
  }

  const onTouchEnd = () => {
    isDragging.current = false
    if (interactedRef.current) {
      onInteractionEnd()
      interactedRef.current = false
    }
  }

  const satX = CENTER + SAT_ORBIT * Math.cos((satAngle * Math.PI) / 180)
  const satY = CENTER + SAT_ORBIT * Math.sin((satAngle * Math.PI) / 180) * 0.4

  const longitudeLines = [-60, -30, 0, 30, 60].map(offset => {
    const angle = ((rotation + offset) * Math.PI) / 180
    const x = CENTER + EARTH_RADIUS * Math.sin(angle)
    return { x, visible: Math.cos(angle) > 0 }
  })

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Orbit path */}
        <ellipse
          cx={CENTER}
          cy={CENTER}
          rx={SAT_ORBIT}
          ry={SAT_ORBIT * 0.4}
          fill="none"
          stroke="#30363D"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Earth */}
        <circle cx={CENTER} cy={CENTER} r={EARTH_RADIUS} fill="#161B22" stroke="#30363D" strokeWidth="1" />

        {/* Latitude lines */}
        {[-30, 0, 30].map((lat, i) => {
          const y = CENTER + (EARTH_RADIUS * Math.sin((lat * Math.PI) / 180))
          const r = EARTH_RADIUS * Math.cos((lat * Math.PI) / 180)
          return (
            <ellipse
              key={i}
              cx={CENTER}
              cy={y}
              rx={r}
              ry={r * 0.25}
              fill="none"
              stroke="#30363D"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Longitude lines */}
        {longitudeLines.map((line, i) => (
          <line
            key={i}
            x1={line.x}
            y1={CENTER - EARTH_RADIUS * 0.95}
            x2={line.x}
            y2={CENTER + EARTH_RADIUS * 0.95}
            stroke={line.visible ? '#30363D' : 'transparent'}
            strokeWidth="0.5"
          />
        ))}

        {/* Earth outline clip */}
        <circle cx={CENTER} cy={CENTER} r={EARTH_RADIUS} fill="none" stroke="#E3B341" strokeWidth="1" />

        {/* Satellite */}
        <g transform={`translate(${satX}, ${satY})`}>
          <rect x="-6" y="-3" width="12" height="6" fill="#E3B341" />
          <rect x="-14" y="-1" width="6" height="2" fill="#30363D" stroke="#E3B341" strokeWidth="0.5" />
          <rect x="8" y="-1" width="6" height="2" fill="#30363D" stroke="#E3B341" strokeWidth="0.5" />
        </g>

        {/* Signal lines from satellite to earth */}
        <line
          x1={satX}
          y1={satY}
          x2={CENTER}
          y2={CENTER}
          stroke="#E3B341"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity="0.4"
        />
      </svg>

      <span className="font-mono text-xs text-dim">drag to rotate · QO-100 orbit sim</span>
    </div>
  )
}