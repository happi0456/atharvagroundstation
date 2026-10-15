'use client'

import { useEffect, useRef, useState } from 'react'

const CX          = 150
const CY          = 115
const EARTH_R     = 62
const ORBIT_RX    = 112
const ORBIT_RY    = 40
const INCLINATION = -30

function toRad(deg) { return deg * Math.PI / 180 }

function orbitPoint(angle) {
  const rad  = toRad(angle)
  const tilt = toRad(INCLINATION)
  const x3   = ORBIT_RX * Math.cos(rad)
  const y3   = ORBIT_RY * Math.sin(rad)
  const xp   = x3
  const yp   = y3 * Math.cos(tilt)
  const zp   = y3 * Math.sin(tilt)
  return { x: CX + xp, y: CY + yp, z: zp }
}

export default function SatelliteKit({ onInteractionEnd }) {
  const [earthRot, setEarthRot] = useState(0)
  const [satAngle, setSatAngle] = useState(45)
  const isDragging  = useRef(false)
  const lastX       = useRef(0)
  const animRef     = useRef(null)
  const interacted  = useRef(false)
  const lastTime    = useRef(null)

  useEffect(() => {
    const tick = (now) => {
      if (!lastTime.current) lastTime.current = now
      const dt = now - lastTime.current
      lastTime.current = now
      if (!isDragging.current) {
        setEarthRot(r => (r + dt * 0.018) % 360)
        setSatAngle(a => (a + dt * 0.055) % 360)
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
    setSatAngle(a => (a + delta * 0.6) % 360)
  }
  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (interacted.current) { onInteractionEnd(); interacted.current = false }
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
    setSatAngle(a => (a + delta * 0.6) % 360)
  }
  const onTouchEnd = () => {
    isDragging.current = false
    if (interacted.current) { onInteractionEnd(); interacted.current = false }
  }

  const sat = orbitPoint(satAngle)
  const isBehind = sat.z < 0 &&
    Math.hypot(sat.x - CX, sat.y - CY) < EARTH_R * 1.05

  // Split orbit into front (z>=0) and back (z<0) segments
  const frontPts = [], backPts = []
  for (let a = 0; a <= 360; a += 2) {
    const p = orbitPoint(a)
    if (p.z >= 0) frontPts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    else          backPts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  }

  // Earth texture offset based on rotation
  const texOffset = ((earthRot % 360) / 360) * 1024

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
      <svg viewBox="0 0 300 210" className="w-full" style={{ background: '#0D1117' }}>
        <defs>
          {/* Clip to earth circle */}
          <clipPath id="earthClip">
            <circle cx={CX} cy={CY} r={EARTH_R} />
          </clipPath>

          {/* Atmosphere radial gradient */}
          <radialGradient id="atmosGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#1A6699" stopOpacity="0"   />
            <stop offset="70%"  stopColor="#0D3A5C" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0A2540" stopOpacity="0.6" />
          </radialGradient>

          {/* Day/night overlay */}
          <linearGradient id="terminator" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.55" />
            <stop offset="45%"  stopColor="#000" stopOpacity="0.1"  />
            <stop offset="55%"  stopColor="#000" stopOpacity="0"    />
            <stop offset="100%" stopColor="#000" stopOpacity="0"    />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit back half */}
        {backPts.length > 1 && (
          <polyline
            points={backPts.join(' ')}
            fill="none" stroke="#2A3540"
            strokeWidth="1" strokeDasharray="3 3"
          />
        )}

        {/* Satellite behind earth */}
        {isBehind && (
          <g transform={`translate(${sat.x}, ${sat.y})`} opacity="0.3">
            <rect x={-6} y={-3} width={12} height={6} fill="#484F58" />
            <rect x={-14} y={-1.5} width={7} height={3} fill="#30363D" />
            <rect x={7}   y={-1.5} width={7} height={3} fill="#30363D" />
          </g>
        )}

        {/* Earth shadow */}
        <ellipse
          cx={CX + 8} cy={CY + EARTH_R * 0.6}
          rx={EARTH_R * 0.9} ry={EARTH_R * 0.25}
          fill="#000" opacity="0.25"
        />

        {/* Earth — real texture */}
        <g clipPath="url(#earthClip)">
          {/* Tile the texture twice so it wraps */}
          <image
            href="/assets/earth.jpg"
            x={CX - EARTH_R - texOffset * (EARTH_R * 2 / 512)}
            y={CY - EARTH_R}
            width={EARTH_R * 2 * 2}
            height={EARTH_R * 2}
            preserveAspectRatio="xMidYMid slice"
          />
          <image
            href="/assets/earth.jpg"
            x={CX - EARTH_R - texOffset * (EARTH_R * 2 / 512) + EARTH_R * 2}
            y={CY - EARTH_R}
            width={EARTH_R * 2 * 2}
            height={EARTH_R * 2}
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Atmosphere overlay */}
          <circle cx={CX} cy={CY} r={EARTH_R}
            fill="url(#atmosGrad)"
          />

          {/* Day/night terminator */}
          <rect
            x={CX - EARTH_R} y={CY - EARTH_R}
            width={EARTH_R * 2} height={EARTH_R * 2}
            fill="url(#terminator)"
          />
        </g>

        {/* Earth rim */}
        <circle cx={CX} cy={CY} r={EARTH_R}
          fill="none" stroke="#1A5A8A" strokeWidth="1.2"
        />

        {/* Atmosphere halo */}
        <circle cx={CX} cy={CY} r={EARTH_R + 5}
          fill="none" stroke="#1A6699"
          strokeWidth="4" opacity="0.18"
          filter="url(#glow)"
        />

        {/* Orbit front half */}
        {frontPts.length > 1 && (
          <polyline
            points={frontPts.join(' ')}
            fill="none" stroke="#3A4A54"
            strokeWidth="1"
          />
        )}

        {/* Signal line */}
        {!isBehind && (
          <line
            x1={sat.x} y1={sat.y}
            x2={CX} y2={CY + EARTH_R - 6}
            stroke="#E3B341" strokeWidth="0.6"
            strokeDasharray="3 3" opacity="0.3"
          />
        )}

        {/* Satellite in front */}
        {!isBehind && (
          <g transform={`translate(${sat.x}, ${sat.y})`}>
            {/* Body */}
            <rect x={-7} y={-4} width={14} height={8}
              fill="#1C2128" stroke="#E3B341" strokeWidth="0.8"
            />
            {/* Solar panels */}
            <rect x={-18} y={-2.5} width={10} height={5}
              fill="#0A1628" stroke="#E3B341" strokeWidth="0.6"
            />
            <line x1={-18} y1={0} x2={-8} y2={0} stroke="#1A3A6A" strokeWidth="0.5" />
            <line x1={-14} y1={-2.5} x2={-14} y2={2.5} stroke="#1A3A6A" strokeWidth="0.5" />
            <rect x={8}   y={-2.5} width={10} height={5}
              fill="#0A1628" stroke="#E3B341" strokeWidth="0.6"
            />
            <line x1={8}  y1={0} x2={18} y2={0} stroke="#1A3A6A" strokeWidth="0.5" />
            <line x1={14} y1={-2.5} x2={14} y2={2.5} stroke="#1A3A6A" strokeWidth="0.5" />
            {/* Antenna */}
            <line x1={0} y1={-4} x2={0} y2={-9}
              stroke="#E3B341" strokeWidth="0.7"
            />
            <circle cx={0} cy={-10} r={1.5} fill="#E3B341" />
          </g>
        )}

        {/* Ground station */}
        <g transform={`translate(${CX}, ${CY + EARTH_R - 3})`}>
          <polygon points="-3,0 3,0 0,-6"
            fill="#E3B341" opacity="0.8"
          />
        </g>

        {/* Info label */}
        <text x={8} y={206}
          fontSize={5.5} fill="#484F58"
          fontFamily="JetBrains Mono, monospace"
        >
          QO-100 · GEO · 35,786 KM ALT
        </text>
      </svg>

      <span className="font-mono text-xs text-dim">drag to rotate · real earth texture</span>
    </div>
  )
}