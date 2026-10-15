import Link from 'next/link'

const legalLinks = []

const externalLinks = [
  { label: 'Atharva College of Engineering', href: 'https://www.atharvacoe.ac.in' },
  { label: 'Atharva University',      href: 'https://atharvauniversity.org' },
  { label: 'LinkedIn',                href: 'https://in.linkedin.com/company/ace-asgs' },
  { label: 'Instagram',               href: 'https://www.instagram.com/atharvasatellitegroundstation/' },
  { label: 'Facebook',                href: 'https://www.facebook.com/AtharvaSatelliteGroundStation/' },
  { label: 'Write to us!',          href: 'mailto:atharvagroundstation-asgs@atharvacoe.ac.in' },    
]

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {externalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-muted hover:text-gold transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-body text-xs text-dim hover:text-muted transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="font-mono text-xs text-dim">
            © 2026 Atharva Satellite Ground Station · Made with ♥ by Geet
          </p>
        </div>

      </div>
    </footer>
  )
}