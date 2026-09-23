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
              <Link
                to={`/p/${project.shortCode}`}
                className="block overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-brand/60"
              >
                {/* Cover: the project name over a soft glow in the project's colour */}
                <div
                  className="flex h-44 items-center justify-center px-6 text-center"
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
                  <h3 className="font-bold">
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
