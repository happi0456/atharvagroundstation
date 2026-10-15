'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About Us', href: '/about'    },
  { label: 'History',  href: '/history'  },
  { label: 'Projects', href: '/projects' },
  { label: 'Team',     href: '/team'     },
  { label: 'Join Us',  href: '/join'     },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <span className="font-mono text-gold text-sm">◈</span>
          <Link href="/" className="font-display font-semibold text-ink text-sm tracking-wide hover:text-gold transition-colors duration-200">
            Atharva Satellite Ground Station
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} className="relative font-body text-sm group py-1">
                <span className={`transition-colors duration-200 ${active ? 'text-gold' : 'text-muted group-hover:text-ink'}`}>
                  {label}
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 h-px bg-gold"
                  initial={false}
                  animate={{ width: active ? '100%' : '0%' }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                />
                <span className="absolute bottom-0 left-0 h-px bg-muted w-0 group-hover:w-full transition-all duration-200" />
              </Link>
            )
          })}
        </div>

      </div>
    </nav>
  )
}