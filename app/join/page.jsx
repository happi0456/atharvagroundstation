const GOOGLE_FORM_URL = 'https://placeholder-google-form-url.com'

const DOMAINS = [
  {
    name: 'RF & Hardware',
    description: 'Work on antenna systems, feed design, LNAs, and the physical RF chain from dish to receiver.',
    skills: ['Basic electronics', 'Antenna theory', 'Signal propagation'],
  },
  {
    name: 'Software & DSP',
    description: 'Build the software stack — GNU Radio pipelines, SDR interfaces, demodulators, and ground station control software.',
    skills: ['Python', 'GNU Radio', 'Signal processing basics'],
  },
  {
    name: 'Satellite Tracking',
    description: 'Develop orbital prediction tools, rotator control systems, and Doppler correction pipelines for live satellite passes.',
    skills: ['Python', 'Orbital mechanics', 'Embedded systems'],
  },
  {
    name: 'Documentation & Outreach',
    description: 'Own the knowledge base — technical writing, system documentation, inter-college collaboration, and public outreach.',
    skills: ['Technical writing', 'Research', 'Communication'],
  },
]

export default function JoinPage() {
  return (
    <div className="pt-16 animate-page">

      {/* Header + CTA */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6 max-w-xl">
            <p className="font-mono text-xs text-gold">OPEN RECRUITMENT</p>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink leading-tight">
              Come build real systems<br />with us.
            </h1>
            <p className="font-body text-muted text-base leading-relaxed">
              We recruit students across all years and all engineering branches. No prior experience in RF or satellite systems is required — we teach what you need. What we look for is curiosity, the willingness to build, and the patience to debug at 2am.
            </p>
          </div>

          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-base text-canvas bg-gold px-8 py-4 hover:bg-gold-muted transition-colors duration-200 w-fit whitespace-nowrap"
          >
            Apply Now →
          </a>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              heading: 'What you get',
              body: 'Hands-on work with real RF hardware, SDR software, and satellite systems. Internal training, mentorship from seniors, and the chance to contribute to live projects from your first semester.',
            },
            {
              heading: 'What we expect',
              body: 'Consistency and curiosity. Show up, ask questions, and build things. We value effort and attitude over pre-existing knowledge.',
            },
            {
              heading: 'How it works',
              body: 'Fill out the application form. Shortlisted candidates will be called for a brief technical and general interaction. Selected members are onboarded at the start of the semester.',
            },
          ].map(({ heading, body }) => (
            <div key={heading} className="flex flex-col gap-3 border-t border-border pt-6">
              <span className="font-display font-semibold text-ink text-lg">{heading}</span>
              <p className="font-body text-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open domains */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display font-semibold text-2xl text-ink mb-12">Open domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {DOMAINS.map((domain) => (
              <div key={domain.name} className="bg-canvas p-8 flex flex-col gap-4">
                <span className="font-mono text-xs text-gold">{domain.name}</span>
                <p className="font-body text-muted text-sm leading-relaxed">{domain.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {domain.skills.map(skill => (
                    <span key={skill} className="font-mono text-xs text-dim border border-border px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}