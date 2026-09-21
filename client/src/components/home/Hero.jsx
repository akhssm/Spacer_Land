import { ArrowRight } from 'lucide-react'
import { getContactLink } from '../../data/homeContent'
import PlotIllustration from './PlotIllustration'

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="eyebrow">For plotted real-estate projects</p>
          <h1>Show every plot on the real map, from one link</h1>
          <p className="hero__lead">
            Replace layout PDFs and inventory spreadsheets with a live, interactive
            layout. Buyers explore the site on satellite view and see what is
            available right now.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href={getContactLink()}>
              Book a demo <ArrowRight size={18} />
            </a>
            <a className="btn btn--ghost" href="#features">
              See the features
            </a>
          </div>
        </div>

        <PlotIllustration />
      </div>
    </section>
  )
}

export default Hero
