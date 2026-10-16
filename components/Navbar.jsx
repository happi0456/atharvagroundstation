'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'About Us', href: '/about'    },
  { label: 'History',  href: '/history'  },
  { label: 'Projects', href: '/projects' },
  { label: 'Team',     href: '/team'     },
  { label: 'Join Us',  href: '/join'     },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <Image
            src="/assets/logo.png"
            alt="ASGS Logo"
            width={48}
            height={48}
            className="object-contain"
          />
            <span className="font-display font-semibold text-ink text-sm tracking-wide group-hover:text-gold transition-colors duration-200">
              Atharva Satellite Ground Station
            </span>
          </Link>
        </div>

        {/* Desktop links — hidden on mobile */}
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
              </Link>
            )
          })}
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-ink transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {/* Mobile dropdown — hidden on desktop */}
      {open && (
        <div className="md:hidden border-t border-border bg-canvas">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-6 py-4 font-body text-sm border-b border-border transition-colors duration-200 ${
                  active ? 'text-gold' : 'text-muted hover:text-ink'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}