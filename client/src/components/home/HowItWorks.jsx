import { STEPS } from '../../data/homeContent'
import Section from './Section'

function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From drawing to shareable link in three steps"
    >
      <ol className="grid grid--3 steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="card step">
            <span className="step__number">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export default HowItWorks
