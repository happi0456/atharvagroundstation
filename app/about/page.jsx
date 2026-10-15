export default function AboutPage() {
  return (
    <div className="pt-16">

      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <p className="font-mono text-xs text-gold mb-4">ABOUT US</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
            Built by students.<br />Operated like a real ground station.
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-semibold text-2xl text-ink">Who we are</h2>
            <p className="font-body text-muted text-base leading-relaxed">
              The Atharva Satellite Ground Station (ASGS) is a student-run technical committee at Atharva College of Engineering/Atharva University, Mumbai. We design, build, and operate real ground station infrastructure from antenna systems and RF hardware to signal processing pipelines and satellite tracking projects.
            </p>
            <p className="font-body text-muted text-base leading-relaxed">
              We are not a club that talks about space. We are a team that builds the systems that talk to it.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-semibold text-2xl text-ink">What drives us</h2>
            <p className="font-body text-muted text-base leading-relaxed">
              Most students graduate having only studied communication systems in theory. At ASGS, we close that gap. Every member works on real hardware, real signals, and real constraints — the same kind of problems faced by aerospace engineers in the field.
            </p>
            <p className="font-body text-muted text-base leading-relaxed">
              Our work spans RF engineering, software-defined radio, embedded systems, and space related systems — all under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display font-semibold text-2xl text-ink mb-12">What we work on</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              {
                domain: 'RF & Hardware',
                description: 'Antenna design, feed systems, low-noise amplifiers, and the physical layer of satellite communication.',
              },
              {
                domain: 'Software & DSP',
                description: 'GNU Radio flowgraphs, SDR pipelines, signal demodulation, and ground station software for Tx/Rx operations.',
              },
              {
                domain: 'Satellite Tracking',
                description: 'Orbital mechanics, TLE-based tracking, azimuth/elevation control, and Doppler correction systems.',
              },
              {
                domain: 'Documentation & Outreach',
                description: 'Technical writing, public engagement, inter-college collaboration, and knowledge transfer within the committee.',
              },
            ].map(({ domain, description }) => (
              <div key={domain} className="bg-canvas p-8 flex flex-col gap-3">
                <span className="font-mono text-xs text-gold">{domain}</span>
                <p className="font-body text-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              label: 'Build first',
              text: 'We prioritise hands-on implementation over passive learning. If something can be built, we build it.',
            },
            {
              label: 'Document everything',
              text: 'Every system we design is documented thoroughly — so the next batch of engineers can pick up exactly where we left off.',
            },
            {
              label: 'No gatekeeping',
              text: 'Domain knowledge is taught internally. We recruit for attitude and curiosity, not prior experience.',
            },
          ].map(({ label, text }) => (
            <div key={label} className="flex flex-col gap-3 border-t border-border pt-6">
              <span className="font-display font-semibold text-ink text-lg">{label}</span>
              <p className="font-body text-muted text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}