import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Image, Info, LocateFixed, Navigation, Search } from 'lucide-react'
import BrochureViewer from '../components/viewer/BrochureViewer'
import { SITE } from '../data/homeContent'
import { SAMPLE_PROJECT } from '../data/sampleProject'

// Until the Projects API exists (Milestone 2), the viewer knows one sample project.
const PROJECTS = { [SAMPLE_PROJECT.shortCode]: SAMPLE_PROJECT }

const PILL =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1c1c]/90 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors'

// The public project page: /p/:shortCode
function Viewer() {
  const { shortCode } = useParams()
  const project = PROJECTS[shortCode]
  const [openPanel, setOpenPanel] = useState(null) // 'brochure' or null

  // Browser tab shows the project name while this page is open
  useEffect(() => {
    const previous = document.title
    document.title = `${project ? project.name : 'Project not found'} | ${SITE.name}`
    return () => {
      document.title = previous
    }
  }, [project])

  if (!project) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <p className="text-muted">There is no project with the code “{shortCode}”.</p>
        <Link to="/" className="text-brand underline underline-offset-4">
          Back to home
        </Link>
      </main>
    )
  }

  const hasBrochure = project.brochure?.pages.length > 0

  // Tools without an onClick are not built yet and show as disabled
  const tools = [
    { icon: Image, label: 'Gallery' },
    { icon: Search, label: 'Search' },
    { icon: LocateFixed, label: 'GPS' },
    {
      icon: BookOpen,
      label: 'Brochure',
      onClick: hasBrochure ? () => setOpenPanel('brochure') : null,
    },
    { icon: Info, label: 'Info' },
    { icon: Navigation, label: 'Locate' },
  ]

  return (
    <main className="bg-grid relative min-h-svh overflow-hidden">
      {/* The satellite map takes this space in Milestone 3 */}
      <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-white/30">
        Satellite map coming in Milestone 3
      </p>

      <header className="absolute top-5 left-5">
        <h1 className="text-2xl font-bold tracking-wider uppercase md:text-3xl">{project.name}</h1>
        <p className="text-xs text-muted">{project.city}</p>
      </header>

      <nav aria-label="Project tools" className="absolute right-5 bottom-5 left-5 md:left-auto">
        <div className="grid grid-cols-3 gap-2 md:flex md:justify-end">
          {tools.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick ?? undefined}
              disabled={!onClick}
              title={onClick ? label : 'Coming soon'}
              className={`${PILL} ${
                onClick ? 'cursor-pointer hover:bg-[#2a2a2a]' : 'cursor-not-allowed opacity-40'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </nav>

      {openPanel === 'brochure' && (
        <BrochureViewer
          pages={project.brochure.pages}
          title={project.name}
          onClose={() => setOpenPanel(null)}
        />
      )}
    </main>
  )
}

export default Viewer
