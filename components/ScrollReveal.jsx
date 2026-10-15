'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}