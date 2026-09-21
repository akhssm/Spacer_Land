import { SITE } from '../../data/homeContent'
import ButtonLink from '../ui/ButtonLink'
import Reveal from '../ui/Reveal'

function CallToAction() {
  return (
    <section className="bg-panel px-5 pt-16 pb-24 text-center">
      <Reveal>
        <h2 className="text-4xl font-bold md:text-5xl">Ready to evolve your process?</h2>
        <div className="mt-8">
          <ButtonLink href="#pricing">Buy {SITE.name}</ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}

export default CallToAction
