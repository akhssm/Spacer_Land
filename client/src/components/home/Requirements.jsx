import { REQUIREMENTS } from '../../data/homeContent'
import Section from './Section'

function Requirements() {
  return (
    <Section
      id="requirements"
      tinted
      eyebrow="Requirements"
      title="Three things to get started"
      subtitle="If you have an approved layout, you already have most of it."
    >
      <div className="grid grid--3">
        {REQUIREMENTS.map(({ icon: Icon, title, text }) => (
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

export default Requirements
