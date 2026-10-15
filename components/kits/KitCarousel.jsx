'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import KitSlot from './kitslot'
import SatelliteKit from './satellitekit'
import SpectrumKit from './spectrumkit'
import MorseKit from './morsekit'
import RoverKit from './roverkit'

const KITS = [SatelliteKit, SpectrumKit, MorseKit, RoverKit]
const SWAP_DELAY = 2500
const AUTO_ROTATE = 20000

export default function KitCarousel({ slot }) {
  const [queue, setQueue] = useState(KITS)
  const [exiting, setExiting] = useState(false)
  const swapTimer = useRef(null)
  const autoTimer = useRef(null)

  const clearTimers = () => {
    clearTimeout(swapTimer.current)
    clearTimeout(autoTimer.current)
  }

  const rotateQueue = useCallback(() => {
    setExiting(true)
    swapTimer.current = setTimeout(() => {
      setQueue(prev => {
        const next = [...prev]
        const removed = next.splice(slot, 1)[0]
        next.push(removed)
        return next
      })
      setExiting(false)
    }, 300)
  }, [slot])

  const handleInteractionEnd = useCallback(() => {
    clearTimers()
    swapTimer.current = setTimeout(() => {
      rotateQueue()
    }, SWAP_DELAY)
  }, [rotateQueue])

  useEffect(() => {
    autoTimer.current = setTimeout(() => {
      rotateQueue()
    }, AUTO_ROTATE)
    return () => clearTimers()
  }, [queue, rotateQueue])

  const ActiveKit = queue[slot]

  return (
    <KitSlot exiting={exiting}>
      <ActiveKit onInteractionEnd={handleInteractionEnd} />
    </KitSlot>
  )
}