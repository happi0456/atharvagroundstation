import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <span className="font-mono text-gold text-sm font-medium">◈</span>
          <Link href="/" className="font-display font-semibold text-ink text-sm tracking-wide">
            Atharva Satellite Ground Station
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'About Us', href: '/about' },
            { label: 'History',  href: '/history' },
            { label: 'Projects', href: '/projects' },
            { label: 'Team',     href: '/team' },
            { label: 'Join Us',  href: '/join' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-body text-sm text-muted hover:text-ink transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </nav>
  )
}