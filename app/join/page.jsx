export default function JoinPage() {
  return (
    <div className="pt-16">
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <p className="font-mono text-xs text-gold mb-4">JOIN US</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
            Build real systems with us.
          </h1>
          <p className="font-body text-muted text-base max-w-xl mt-6 leading-relaxed">
            Whether you are into RF hardware, software, signal processing, or documentation — there is a place for you at ASGS. No prior experience required.
          </p>
          <a
            href="mailto:atharvagroundstation-asgs@atharvacoe.ac.in?subject=ASGS%20Join%20Request"
            className="inline-block mt-8 font-mono text-sm text-canvas bg-gold px-5 py-2.5 hover:bg-gold-muted transition-colors duration-200"
          >
            Email us to apply
          </a>
        </div>
      </section>
    </div>
  )
}
