import { ArrowRight } from 'lucide-react'
import { getContactLink } from '../../data/homeContent'

function CallToAction() {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <h2>Ready to put your layout on the map?</h2>
        <p>Send us your layout and see your own project as a live, shareable link.</p>
        <a className="btn btn--light" href={getContactLink()}>
          Book a demo <ArrowRight size={18} />
        </a>
      </div>
    </section>
  )
}

export default CallToAction
