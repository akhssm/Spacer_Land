import { REQUIREMENTS } from '../../data/homeContent'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

function Requirements() {
  return (
    <section id="requirements" className="bg-panel px-5 py-20">
      <div className="mx-auto w-full max-w-275">
        <SectionHeading title="Requirements to Start" />

        <Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {REQUIREMENTS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-lg border border-line bg-card p-6 pb-8">
                <span className="inline-flex size-12 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Requirements
