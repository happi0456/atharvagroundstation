const PROJECTS = [
  {
    id: 'qo-100',
    code: 'QO-100',
    name: 'Qatar OSCAR-100 Ground Station',
    description: 'Design and operation of a full-duplex ground station for communication with QO-100, the first geostationary amateur satellite. Covers dish alignment, LNB feed systems, and SDR-based signal reception.',
    tags: ['RF Hardware', 'SDR', 'Geostationary', 'Full-Duplex'],
    status: 'ACTIVE',
  },
  {
    id: 'sdr-pipeline',
    code: 'SDR-RX',
    name: 'Software Defined Radio Pipeline',
    description: 'End-to-end SDR pipeline for signal reception, demodulation, and decoding using GNU Radio. Supports multiple satellite modes including FM, BPSK, and AFSK1200.',
    tags: ['GNU Radio', 'DSP', 'Python', 'RTL-SDR'],
    status: 'ACTIVE',
  },
  {
    id: 'cansat',
    code: 'CANSAT-J',
    name: 'CanSat Juniors Mission',
    description: 'Two-stage CanSat mission featuring environmental sensing in Stage 1 and IMU/GPS telemetry in Stage 2. Full ground station software developed in-house for real-time data reception.',
    tags: ['Embedded', 'Telemetry', 'IMU', 'GPS'],
    status: 'COMPLETED',
  },
  {
    id: 'tracker',
    code: 'AZ-EL',
    name: 'Antenna Azimuth/Elevation Tracker',
    description: 'Motorised antenna rotator system with TLE-based orbital prediction for automatic satellite tracking. Built on top of open-source rotator controller firmware with a custom software interface.',
    tags: ['Tracking', 'Embedded', 'Orbital Mechanics', 'Python'],
    status: 'IN PROGRESS',
  },
]

const statusStyle = {
  'ACTIVE':      'text-gold border-gold',
  'COMPLETED':   'text-muted border-muted',
  'IN PROGRESS': 'text-ink border-ink',
}

export default function ProjectsPage() {
  return (
    <div className="pt-16">

      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <p className="font-mono text-xs text-gold mb-4">ACTIVE BUILDS & COMPLETED WORK</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
            Systems we've designed,<br />built, and operated.
          </h1>
        </div>
      </section>

      {/* Projects grid */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {PROJECTS.map((project) => (
              <div key={project.id} className="bg-canvas p-8 flex flex-col gap-6">

                {/* Image placeholder */}
                <div className="w-full aspect-video bg-surface border border-border flex items-center justify-center">
                  <span className="font-mono text-xs text-dim">[ {project.code} · image placeholder ]</span>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">{project.code}</span>
                  <span className={`font-mono text-xs border px-2 py-0.5 ${statusStyle[project.status]}`}>
                    {project.status}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h2 className="font-display font-semibold text-xl text-ink">{project.name}</h2>
                  <p className="font-body text-muted text-sm leading-relaxed">{project.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs text-dim border border-border px-2 py-0.5">
                      {tag}
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