import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects } from '../../api/projects'
import { SITE } from '../../data/homeContent'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

function Demos() {
  const [projects, setProjects] = useState(null) // null while loading
  const [error, setError] = useState('')

  // The cards come from the API, so adding a project to the database adds a card here
  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setError('Could not load the projects. Is the API running?'))
  }, [])

  return (
    <section id="demos" className="px-5 py-20">
      <div className="mx-auto w-full max-w-275">
        <SectionHeading eyebrow="Live projects" title="Product Demos" />

        {error && <p className="text-muted">{error}</p>}
        {!error && !projects && <p className="text-muted">Loading projects…</p>}

        <div className="grid gap-5 md:grid-cols-2">
          {projects?.map((project) => (
            <Reveal key={project.shortCode}>
              {/* On hover the card lifts with a lime border and glow, the cover zooms and the name turns lime */}
              <Link
                to={`/p/${project.shortCode}`}
                className="group block overflow-hidden rounded-lg border border-line bg-card transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_24px_rgba(117,194,23,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Cover: the project name over a soft glow in the project's colour */}
                <div
                  className="flex h-44 items-center justify-center px-6 text-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${project.theme.accent}55, #0c0c0c 70%)`,
                  }}
                >
                  <span
                    className="text-3xl font-bold uppercase tracking-widest"
                    style={{ color: project.theme.accent }}
                  >
                    {project.name}
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
                  <h3 className="font-bold transition-colors duration-700 group-hover:text-brand">
                    {project.name}
                    <span className="ml-2 text-xs font-normal text-muted">
                      • {project.city} • {project.unitCount} {project.unitLabel.toLowerCase()}s
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-muted">{project.description}</p>
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
