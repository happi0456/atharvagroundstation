'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageWrapper({ children }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    setTransitionStage('fadeOut')
  }, [pathname])

  return (
    <motion.div
      className="flex-1"
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{
        opacity: transitionStage === 'fadeIn' ? 1 : 0,
      }}
      onAnimationComplete={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayChildren(children)
          setTransitionStage('fadeIn')
        }
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {displayChildren}
    </motion.div>
  )
}