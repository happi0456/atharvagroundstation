const FACULTY = [
  {
    id: 'faculty-1',
    name: 'Dr. Kiruthika B.',
    role: 'Faculty Coordinator',
    department: 'HOD Electronics & Telecommunication',
    image: ''
  },
]

const MEMBERS = [
  { id: 'm1',  name: 'Komal Joshi', role: 'Team Leader', image: ''},
  { id: 'm2',  name: 'Lokanath Behra', role: 'Technical Head', image: ''},
  { id: 'm3',  name: 'Soham Raut', role: 'Technical Head', image: ''},
  { id: 'm4',  name: 'Rudraprasad Dabre', role: 'Design Architect', image: ''},
  { id: 'm5',  name: 'Hemavathi Chettiyar', role: 'Social Media Head', image: ''},
  { id: 'm6',  name: 'Krupa Bilade', role: 'Documentation Head', image: ''},
  { id: 'm7',  name: 'Shalu Singh', role: 'Logistics Head', image: ''},
  { id: 'm8',  name: 'Isha Hazra', role: 'Member', image: ''},
  { id: 'm9',  name: 'Vignesh Thevar', role: 'Member', image: ''},
  { id: 'm10', name: 'Ayush Shukla', role: 'Member', image: ''},
  { id: 'm11', name: 'Geet Pimple', role: 'Member', image: ''},
  { id: 'm12', name: 'Ashish Kumbhar', role: 'Member', image: ''},
  { id: 'm13', name: 'Md. Husain Shaikh', role: 'Member', image : ''},
  { id: 'm14', name: 'Vrushali Surve', role: 'Member', image: ''},
]

export default function TeamPage() {
  return (
    <div className="pt-16">

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <p className="font-mono text-xs text-gold mb-4">THE PEOPLE</p>
          <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
            Engineers, developers,<br />and builders.
          </h1>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-display font-semibold text-xl text-ink mb-10">Faculty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {FACULTY.map((f) => (
              <div key={f.id} className="bg-canvas p-8 flex flex-col gap-4 border border-gold">
                <div className="w-16 h-16 rounded-full bg-surface border border-gold flex items-center justify-center">
                  <span className="font-mono text-xs text-dim">IMG</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-display font-semibold text-ink text-base">{f.name}</span>
                  <span className="font-mono text-xs text-gold">{f.role}</span>
                  <span className="font-mono text-xs text-dim">{f.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="font-display font-semibold text-xl text-ink mb-10">Members</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {MEMBERS.map((member) => (
              <div key={member.id} className="bg-canvas p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
                  <span className="font-mono text-xs text-dim">IMG</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-display font-semibold text-ink text-sm">{member.name}</span>
                  <span className="font-mono text-xs text-gold">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}