import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Image, Info, LocateFixed, MessageCircle, Navigation, Search } from 'lucide-react'
import BrochureViewer from '../components/viewer/BrochureViewer'
import MapView from '../components/viewer/MapView'
import { InfoPanel, PlotCard, SearchPanel } from '../components/viewer/Panels'
import { SITE, getContactLink } from '../data/homeContent'
import { getProject } from '../data/projects'
import { directionsUrl } from '../lib/geo'

const PILL =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1c1c]/90 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors'

// Written out in full so Tailwind can find the classes
const STATUS_SWATCH = {
  available: 'bg-available',
  sold: 'bg-sold',
  hold: 'bg-hold',
  reserved: 'bg-reserved',
}

// On/off switch like the ones in the original viewer
function Toggle({ label, on, onChange }) {
  return (
    <label className={`${PILL} cursor-pointer gap-3`}>
      {label}
      <input type="checkbox" checked={on} onChange={onChange} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-white/20 transition-colors peer-checked:bg-brand after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  )
}

// The public project page: /p/:shortCode
function Viewer() {
  const { shortCode } = useParams()
  const project = getProject(shortCode)

  const [openPanel, setOpenPanel] = useState(null) // 'brochure' | 'search' | 'info' | null
  const [colorMode, setColorMode] = useState('plain') // 'plain' | 'zones' | 'status'
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [gpsOn, setGpsOn] = useState(false)
  const [toast, setToast] = useState('')
  const gpsWatchRef = useRef(null) // id returned by watchPosition, needed to stop it

  // Browser tab shows the project name while this page is open
  useEffect(() => {
    const previous = document.title
    document.title = `${project ? project.name : 'Project not found'} | ${SITE.name}`
    return () => {
      document.title = previous
    }
  }, [project])

  // Stop watching GPS when the page closes
  useEffect(() => {
    return () => {
      if (gpsWatchRef.current !== null) navigator.geolocation.clearWatch(gpsWatchRef.current)
    }
  }, [])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

  const selectPlot = useCallback((plot) => {
    setSelectedPlot(plot)
    if (plot) setOpenPanel(null)
  }, [])

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

  const stopGps = () => {
    if (gpsWatchRef.current !== null) navigator.geolocation.clearWatch(gpsWatchRef.current)
    gpsWatchRef.current = null
    setUserPosition(null)
    setGpsOn(false)
  }

  const toggleGps = () => {
    if (gpsOn) {
      stopGps()
      return
    }
    if (!navigator.geolocation) {
      showToast('Location is not available on this device')
      return
    }
    setGpsOn(true)
    gpsWatchRef.current = navigator.geolocation.watchPosition(
      (position) => setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => {
        showToast('Could not get your location')
        stopGps()
      },
      { enableHighAccuracy: true },
    )
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: project.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        showToast('Link copied')
      }
    } catch {
      // the visitor cancelled the share sheet
    }
  }

  const hasBrochure = project.brochure.pages.length > 0
  const whatsappLink = project.whatsapp
    ? `https://wa.me/${project.whatsapp}?text=${encodeURIComponent(`Hi, I am interested in ${project.name}.`)}`
    : getContactLink()

  // Tools without an onClick or href are not built yet and show as disabled
  const tools = [
    { icon: Image, label: 'Gallery' },
    { icon: Search, label: 'Search', onClick: () => setOpenPanel('search') },
    { icon: LocateFixed, label: 'GPS', onClick: toggleGps, active: gpsOn },
    { icon: BookOpen, label: 'Brochure', onClick: hasBrochure ? () => setOpenPanel('brochure') : null },
    { icon: Info, label: 'Info', onClick: () => setOpenPanel('info') },
    { icon: Navigation, label: 'Locate', href: directionsUrl(project.location) },
  ]

  return (
    <main className="relative h-svh overflow-hidden bg-base">
      <MapView
        project={project}
        colorMode={colorMode}
        selectedPlot={selectedPlot}
        onSelectPlot={selectPlot}
        userPosition={userPosition}
        onShare={share}
      />

      <header className="absolute top-5 left-5">
        <h1 className="text-2xl font-bold tracking-wider uppercase drop-shadow md:text-3xl">{project.name}</h1>
        <p className="text-xs text-white/70">
          {project.city}
          {project.layout.sample && <span className="ml-2 rounded bg-hold/80 px-1.5 text-[10px] font-bold text-black uppercase">Sample layout</span>}
        </p>
      </header>

      {colorMode === 'status' && (
        <ul className="absolute top-5 right-5 flex flex-col gap-1 rounded-lg bg-black/60 p-2 text-xs backdrop-blur">
          {Object.entries(STATUS_SWATCH).map(([status, swatch]) => (
            <li key={status} className="flex items-center gap-2 capitalize">
              <span className={`size-3 rounded-sm ${swatch}`} /> {status}
            </li>
          ))}
        </ul>
      )}

      <div className="absolute right-5 bottom-5 left-5 flex flex-col items-stretch gap-2 md:left-auto md:items-end">
        <div className="flex flex-wrap justify-end gap-2">
          <Toggle label="Zones" on={colorMode === 'zones'} onChange={() => setColorMode(colorMode === 'zones' ? 'plain' : 'zones')} />
          <Toggle label="Status" on={colorMode === 'status'} onChange={() => setColorMode(colorMode === 'status' ? 'plain' : 'status')} />
          <a href={whatsappLink} target="_blank" rel="noreferrer" className={`${PILL} hover:bg-[#2a2a2a]`}>
            <MessageCircle size={18} className="text-[#25d366]" />
            <span className="text-left leading-tight">
              WhatsApp
              <span className="block text-[11px] font-normal text-muted">Inquire project</span>
            </span>
          </a>
        </div>

        <nav aria-label="Project tools" className="grid grid-cols-3 gap-2">
          {tools.map(({ icon: Icon, label, onClick, href, active }) => {
            const enabled = Boolean(onClick || href)
            const className = `${PILL} ${enabled ? 'cursor-pointer hover:bg-[#2a2a2a]' : 'cursor-not-allowed opacity-40'} ${active ? 'text-brand' : ''}`
            return href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" className={className}>
                <Icon size={16} /> {label}
              </a>
            ) : (
              <button key={label} type="button" onClick={onClick ?? undefined} disabled={!enabled} title={enabled ? label : 'Coming soon'} aria-pressed={active} className={className}>
                <Icon size={16} /> {label}
              </button>
            )
          })}
        </nav>
      </div>

      {selectedPlot && !openPanel && (
        <PlotCard project={project} plot={selectedPlot} showStatus={colorMode === 'status'} onClose={() => setSelectedPlot(null)} />
      )}
      {openPanel === 'search' && <SearchPanel project={project} onSelect={selectPlot} onClose={() => setOpenPanel(null)} />}
      {openPanel === 'info' && <InfoPanel project={project} onClose={() => setOpenPanel(null)} />}
      {openPanel === 'brochure' && (
        <BrochureViewer pages={project.brochure.pages} title={project.name} onClose={() => setOpenPanel(null)} />
      )}

      {toast && (
        <p role="status" className="absolute bottom-48 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
          {toast}
        </p>
      )}
    </main>
  )
}

export default Viewer
