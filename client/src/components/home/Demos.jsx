import { Link } from 'react-router-dom'
import { DEMOS, SITE } from '../../data/homeContent'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

function Demos() {
  return (
    <section id="demos" className="px-5 py-20">
      <div className="mx-auto w-full max-w-275">
        <SectionHeading eyebrow="Live projects" title="Product Demos" />

        <div className="grid gap-5 md:grid-cols-2">
          {DEMOS.map((demo) => (
            <Reveal key={demo.name}>
              <Link
                to={demo.href}
                className="block overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-brand/60"
              >
                {/* Cover: the project name over a soft glow in the project's colour */}
                <div
                  className="flex h-44 items-center justify-center px-6 text-center"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${demo.glow}55, #0c0c0c 70%)`,
                  }}
                >
                  <span
                    className="text-3xl font-bold uppercase tracking-widest"
                    style={{ color: demo.glow }}
                  >
                    {demo.name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-line bg-[#111] px-7 py-6">
                  <span className="text-2xl font-bold uppercase tracking-wider">{SITE.name}</span>
                  <span className="text-right text-xs uppercase leading-5 tracking-wide text-white/80">
                    Interactive
                    <br />
                    plot viewing
                  </span>
                </div>

                <div className="px-5 py-4">
                  <h3 className="font-bold">
                    {demo.name}
                    <span className="ml-2 text-xs font-normal text-muted">• {demo.city}</span>
                  </h3>
                  <p className="mt-1 text-sm text-muted">{demo.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Demos
