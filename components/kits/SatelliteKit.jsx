'use client'

import { useEffect, useRef, useState } from 'react'

const CX = 150
const CY = 130
const EARTH_R = 55
const ORBIT_RX = 110
const ORBIT_RY = 38
const INCLINATION = -28 // degrees tilt of orbital plane

function toRad(deg) { return deg * Math.PI / 180 }

// Project a point on the inclined orbit to SVG 2D
function orbitPoint(angle) {
  const rad = toRad(angle)
  const tilt = toRad(INCLINATION)
  // 3D orbit coords
  const x3 = ORBIT_RX * Math.cos(rad)
  const y3 = ORBIT_RY * Math.sin(rad)
  // Rotate around X axis to incline the orbit
  const xp = x3
  const yp = y3 * Math.cos(tilt)
  const zp = y3 * Math.sin(tilt)
  return { x: CX + xp, y: CY + yp, z: zp }
}

// Earth texture lines
function earthLatLines(rotDeg) {
  return [-40, -20, 0, 20, 40].map(lat => {
    const r = toRad(lat)
    const ry = EARTH_R * Math.cos(r)
    const cy = CY + EARTH_R * Math.sin(r)
    return { cy, rx: ry, ry: ry * 0.25 }
  })
}

function earthLonLines(rotDeg) {
  return [-60, -30, 0, 30, 60].map(offset => {
    const angle = toRad(rotDeg + offset)
    const x = CX + EARTH_R * Math.sin(angle)
    const visible = Math.cos(angle) > 0
    return { x, visible }
  })
}

export default function SatelliteKit({ onInteractionEnd }) {
  const [earthRot, setEarthRot]   = useState(0)
  const [satAngle, setSatAngle]   = useState(45)
  const isDragging                = useRef(false)
  const lastX                     = useRef(0)
  const animRef                   = useRef(null)
  const interacted                = useRef(false)

  useEffect(() => {
    let lastTime = performance.now()
    const tick = (now) => {
      const dt = now - lastTime
      lastTime = now
      if (!isDragging.current) {
        setEarthRot(r => (r + dt * 0.02) % 360)
        setSatAngle(a => (a + dt * 0.06) % 360)
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const onMouseDown = (e) => {
    isDragging.current = true
    lastX.current = e.clientX
    interacted.current = true
  }
  const onMouseMove = (e) => {
    if (!isDragging.current) return
    const delta = e.clientX - lastX.current
    lastX.current = e.clientX
    setEarthRot(r => (r + delta * 0.4) % 360)
    setSatAngle(a => (a + delta * 0.7) % 360)
  }
  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (interacted.current) {
      onInteractionEnd()
      interacted.current = false
    }
  }
  const onTouchStart = (e) => {
    isDragging.current = true
    lastX.current = e.touches[0].clientX
    interacted.current = true
  }
  const onTouchMove = (e) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientX - lastX.current
    lastX.current = e.touches[0].clientX
    setEarthRot(r => (r + delta * 0.4) % 360)
    setSatAngle(a => (a + delta * 0.7) % 360)
  }
  const onTouchEnd = () => {
    isDragging.current = false
    if (interacted.current) {
      onInteractionEnd()
      interacted.current = false
    }
  }

  const sat = orbitPoint(satAngle)
  const isBehindEarth = sat.z < 0 && Math.hypot(sat.x - CX, sat.y - CY) < EARTH_R * 1.1

  // Build orbit path for front and back halves
  const orbitFrontPoints = []
  const orbitBackPoints  = []
  for (let a = 0; a <= 360; a += 3) {
    const p = orbitPoint(a)
    if (p.z >= 0) orbitFrontPoints.push(`${p.x},${p.y}`)
    else          orbitBackPoints.push(`${p.x},${p.y}`)
  }

  const latLines = earthLatLines(earthRot)
  const lonLines = earthLonLines(earthRot)

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <svg viewBox="0 0 300 220" className="w-full" style={{ background: '#0D1117' }}>

        {/* Orbit back half (behind earth) */}
        {orbitBackPoints.length > 1 && (
          <polyline
            points={orbitBackPoints.join(' ')}
            fill="none"
            stroke="#30363D"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Satellite behind earth */}
        {isBehindEarth && (
          <circle cx={sat.x} cy={sat.y} r={4} fill="#484F58" />
        )}

        {/* Earth shadow */}
        <ellipse cx={CX + 6} cy={CY + 8} rx={EARTH_R} ry={EARTH_R * 0.35}
          fill="#000" opacity="0.3"
        />

        {/* Earth base */}
        <circle cx={CX} cy={CY} r={EARTH_R} fill="#0D1B2A" stroke="#30363D" strokeWidth="1" />

        {/* Earth latitude lines */}
        {latLines.map((l, i) => (
          <ellipse key={i}
            cx={CX} cy={l.cy}
            rx={l.rx} ry={l.ry}
            fill="none" stroke="#1C3A5E" strokeWidth="0.6"
          />
        ))}

        {/* Earth longitude lines */}
        {lonLines.map((l, i) => l.visible && (
          <line key={i}
            x1={l.x} y1={CY - EARTH_R * 0.97}
            x2={l.x} y2={CY + EARTH_R * 0.97}
            stroke="#1C3A5E" strokeWidth="0.6"
          />
        ))}

        {/* Earth terminator (day/night) */}
        <path
          d={`M ${CX} ${CY - EARTH_R} A ${EARTH_R} ${EARTH_R} 0 0 1 ${CX} ${CY + EARTH_R} Z`}
          fill="#000" opacity="0.25"
        />

        {/* Earth rim */}
        <circle cx={CX} cy={CY} r={EARTH_R}
          fill="none" stroke="#2A5FA0" strokeWidth="1.2"
        />

        {/* Atmosphere glow */}
        <circle cx={CX} cy={CY} r={EARTH_R + 4}
          fill="none" stroke="#1A4A80" strokeWidth="3" opacity="0.3"
        />

        {/* Orbit front half */}
        {orbitFrontPoints.length > 1 && (
          <polyline
            points={orbitFrontPoints.join(' ')}
            fill="none"
            stroke="#30363D"
            strokeWidth="1"
          />
        )}

        {/* Signal lines */}
        {!isBehindEarth && (
          <line
            x1={sat.x} y1={sat.y}
            x2={CX} y2={CY}
            stroke="#E3B341" strokeWidth="0.6"
            strokeDasharray="3 3" opacity="0.35"
          />
        )}

        {/* Satellite in front */}
        {!isBehindEarth && (
          <g transform={`translate(${sat.x}, ${sat.y})`}>
            {/* Body */}
            <rect x={-7} y={-4} width={14} height={8}
              fill="#1C2128" stroke="#E3B341" strokeWidth="0.8"
            />
            {/* Solar panels */}
            <rect x={-18} y={-2} width={9} height={4}
              fill="#0D1117" stroke="#E3B341" strokeWidth="0.6"
            />
            <line x1={-18} y1={0} x2={-9} y2={0} stroke="#30363D" strokeWidth="0.4" />
            <rect x={9}  y={-2} width={9} height={4}
              fill="#0D1117" stroke="#E3B341" strokeWidth="0.6"
            />
            <line x1={9} y1={0} x2={18} y2={0} stroke="#30363D" strokeWidth="0.4" />
            {/* Antenna */}
            <line x1={0} y1={-4} x2={0} y2={-9} stroke="#E3B341" strokeWidth="0.6" />
            <circle cx={0} cy={-10} r={1.5} fill="#E3B341" />
          </g>
        )}

        {/* Ground station indicator */}
        <polygon points={`${CX - 4},${CY + EARTH_R - 2} ${CX + 4},${CY + EARTH_R - 2} ${CX},${CY + EARTH_R - 10}`}
          fill="#E3B341" opacity="0.7"
        />

        {/* Labels */}
        <text x={8} y={215} fontSize={6} fill="#484F58" fontFamily="JetBrains Mono, monospace">
          QO-100 · GEOSTATIONARY ORBIT · 35,786 KM
        </text>
      </svg>

      <span className="font-mono text-xs text-dim">drag to rotate · inclined orbit sim</span>
    </div>
  )
}