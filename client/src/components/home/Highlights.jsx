import { HIGHLIGHTS } from '../../data/homeContent'
import Section from './Section'

function Highlights() {
  return (
    <Section
      eyebrow="Why switch"
      title="No PDFs. No spreadsheets. One live layout."
      subtitle="Everything a buyer asks for, and everything your team keeps updating, in one place."
    >
      <div className="grid grid--3">
        {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
          <article key={title} className="card">
            <span className="icon-badge">
              <Icon size={22} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default Highlights
