import { ChevronDown } from 'lucide-react'
import { FAQS } from '../../data/homeContent'
import Section from './Section'

function Faq() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions developers ask first">
      <div className="faq">
        {FAQS.map((faq) => (
          // <details> opens and closes by itself, so no React state is needed.
          // Sharing one "name" makes the browser keep only one item open.
          <details key={faq.question} name="faq" className="faq__item">
            <summary>
              {faq.question}
              <ChevronDown size={20} className="faq__chevron" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

export default Faq
