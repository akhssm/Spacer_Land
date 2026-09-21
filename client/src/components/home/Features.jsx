import { FEATURES } from '../../data/homeContent'
import Reveal from '../ui/Reveal'

function Features() {
  return (
    <section id="features" className="bg-panel px-5 py-20">
      <div className="mx-auto w-full max-w-324">
        <h2 className="mb-8 text-3xl font-bold md:text-4xl">{FEATURES.length}+ Features</h2>

        <Reveal>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
            {FEATURES.map(({ icon: Icon, title }) => (
              <article
                key={title}
                className="rounded-lg border border-line bg-card p-4 transition-colors hover:border-brand/60"
              >
                <Icon size={26} strokeWidth={1.6} className="text-brand" />
                <h3 className="mt-7 mb-1 text-[15px]">{title}</h3>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Features
