import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import KitCarousel from '@/components/kits/KitCarousel'

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* DIV 1 — Hero */}
      <section className="min-h-screen pt-16 flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-24">
          <ScrollReveal className="flex flex-col justify-center gap-6">
            <span className="font-mono text-xs text-gold">ATHARVA SATELLITE GROUND STATION</span>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink leading-tight">
              We innovate communication,<br />We communicate innovation.
            </h1>
            <p className="font-body text-muted text-base max-w-md">
              A student-run satellite ground station committee at Atharva College of Engineering, Mumbai — building real RF infrastructure, tracking live satellites, and developing ground station software from the ground up.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="/join"
                className="font-mono text-sm text-canvas bg-gold px-5 py-2.5 hover:bg-gold-muted transition-colors duration-200"
              >
                Join Us
              </Link>
              <Link
                href="/projects"
                className="font-mono text-sm text-muted border border-border px-5 py-2.5 hover:text-ink hover:border-muted transition-colors duration-200"
              >
                Our Projects
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="flex items-center justify-center">
            <div className="w-full aspect-square max-w-sm border border-border overflow-hidden">
              <KitCarousel slot={0} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DIV 2 — What We Do */}
      <section className="min-h-screen flex items-center border-b border-border">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-24">

          <ScrollReveal delay={0.1} className="flex items-center justify-center">
            <div className="w-full aspect-square max-w-sm border border-border overflow-hidden">
              <KitCarousel slot={1} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="flex flex-col justify-center gap-6">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink">
              What we do
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                'Design and operate RF ground station hardware for satellite communication',
                'Develop software-defined radio pipelines for signal transmission and reception',
                'Track and communicate with amateur satellites including Qatar OSCAR-100',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-mono text-gold mt-1">—</span>
                  <span className="font-body text-muted text-base">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-body text-muted text-base max-w-md border-l-2 border-gold pl-4">
              From antenna design to signal processing, we build every layer of the ground station stack — giving students hands-on experience with real aerospace-grade systems.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* DIV 3 — Join Us & Contact */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-24">

          <ScrollReveal className="flex flex-col justify-center gap-6 border-r border-border pr-12">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink">
              Join us
            </h2>
            <p className="font-body text-muted text-base max-w-sm">
              Whether you're into RF hardware, software development, signal processing, or technical documentation — there's a place for you at ASGS. No prior experience required, just the drive to build real systems.
            </p>
            <Link
              href="/join"
              className="font-mono text-sm text-canvas bg-gold px-5 py-2.5 w-fit hover:bg-gold-muted transition-colors duration-200"
            >
              Apply Now
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="flex flex-col justify-center gap-6 pl-12">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink">
              Contact us
            </h2>
            <p className="font-body text-muted text-base">
              For queries, collaborations, research partnerships, or just to talk satellites — we're reachable at:
            </p>
            <a
              href="mailto:atharvagroundstation-asgs@atharvacoe.ac.in"
              className="font-mono text-sm text-gold hover:text-gold-muted transition-colors duration-200 break-all"
            >
              atharvagroundstation-asgs@atharvacoe.ac.in
            </a>
          </ScrollReveal>

        </div>
      </section>

    </div>
  )
}