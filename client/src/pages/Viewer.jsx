import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Image, Info, LocateFixed, MessageCircle, Navigation, Search } from 'lucide-react'
import BrochureViewer from '../components/viewer/BrochureViewer'
import GalleryViewer from '../components/viewer/GalleryViewer'
import MapView from '../components/viewer/MapView'
import { AmenityPanel, BlockChips, BlockPanel, FlatPanel, InfoPanel, PlotCard, SearchPanel } from '../components/viewer/Panels'
import { fetchProject } from '../api/projects'
import { SITE, getContactLink } from '../data/homeContent'
import { directionsUrl } from '../lib/geo'
import { towerStatus, unitsByTower } from '../lib/inventory'

const PILL =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1c1c]/90 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors'

const NO_BLOCKS = [] // shared empty lists, so they never count as a change
const NO_UNITS = []

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

// The public project page: /p/:shortCode. The key makes React start the page
// fresh (no stale project, selection or panels) when the code in the URL changes.
function Viewer() {
  const { shortCode } = useParams()
  return <ProjectViewer key={shortCode} shortCode={shortCode} />
}

function ProjectViewer({ shortCode }) {
  const [project, setProject] = useState(null)
  const [loadError, setLoadError] = useState(null) // an Error with .status, or null
  const [openPanel, setOpenPanel] = useState(null) // 'brochure' | 'search' | 'info' | null
  const [colorMode, setColorMode] = useState('plain') // 'plain' | 'zones' | 'status'
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [selectedBlock, setSelectedBlock] = useState(null) // a block name, or null for all
  const [selectedUnit, setSelectedUnit] = useState(null) // one flat on one floor, for the enquiry
  const [userPosition, setUserPosition] = useState(null)
  const [gpsOn, setGpsOn] = useState(false)
  const [toast, setToast] = useState('')
  const gpsWatchRef = useRef(null) // id returned by watchPosition, needed to stop it

  // Load the project from the API
  useEffect(() => {
    let cancelled = false

    fetchProject(shortCode)
      .then((data) => !cancelled && setProject(data))
      .catch((error) => !cancelled && setLoadError(error))

    return () => {
      cancelled = true // ignore a late answer if the visitor already moved on
    }
  }, [shortCode])

  // Browser tab shows the project name while this page is open
  useEffect(() => {
    if (!project && !loadError) return
    const previous = document.title
    document.title = `${project ? project.name : 'Project not found'} | ${SITE.name}`
    return () => {
      document.title = previous
    }
  }, [project, loadError])

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

  const blocks = project?.layout.blocks ?? NO_BLOCKS
  const units = project?.units ?? NO_UNITS
  const towerUnits = useMemo(() => unitsByTower(units), [units])
  // The map colours each tower from its units' statuses; kept stable so the map is not rebuilt
  const mapProject = useMemo(() => {
    if (!project) return null
    if (!units.length) return project
    return {
      ...project,
      layout: {
        ...project.layout,
        plots: project.layout.plots.map((plot) => (towerUnits[plot.number] ? { ...plot, status: towerStatus(towerUnits[plot.number]) } : plot)),
      },
    }
  }, [project, units, towerUnits])

  // Choosing a flat also chooses its block, so the other blocks fade back
  const selectPlot = useCallback(
    (plot) => {
      setSelectedPlot(plot)
      setSelectedUnit(null)
      if (plot) {
        setOpenPanel(null)
        if (blocks.some((block) => block.name === plot.zone)) setSelectedBlock(plot.zone)
      }
    },
    [blocks],
  )

  const selectBlock = useCallback((name) => {
    setSelectedBlock(name)
    setSelectedPlot(null)
    setSelectedUnit(null)
  }, [])

  // From the block grid: open that tower's panel with the chosen floor highlighted
  const selectUnitInTower = (tower, unit) => {
    setSelectedPlot(tower)
    setSelectedUnit(unit)
    setOpenPanel(null)
  }

  if (loadError) {
    const notFound = loadError.status === 404
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-3xl font-bold">{notFound ? 'Project not found' : 'Could not load the project'}</h1>
        <p className="text-muted">
          {notFound ? `There is no project with the code “${shortCode}”.` : loadError.message}
        </p>
        <Link to="/" className="text-brand underline underline-offset-4">
          Back to home
        </Link>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-base text-sm text-muted">
        Loading project…
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
  const gallery = project.gallery ?? []
  // Flats and amenities open a panel on the right on desktop, so other controls move out from under it
  const blockPanelOpen = Boolean(selectedBlock) && !selectedPlot && units.length > 0
  const sidePanelOpen = Boolean(selectedPlot?.plan || selectedPlot?.kind === 'amenity' || blockPanelOpen) && !openPanel
  // WhatsApp link with a ready-made message, or the site's contact link if the project has no number
  const enquiryLink = (message) =>
    project.whatsapp ? `https://wa.me/${project.whatsapp}?text=${encodeURIComponent(message)}` : getContactLink()
  const whatsappLink = enquiryLink(`Hi, I am interested in ${project.name}.`)

  // Tools without an onClick or href are not built yet and show as disabled
  const tools = [
    { icon: Image, label: 'Gallery', onClick: gallery.length ? () => setOpenPanel('gallery') : null },
    { icon: Search, label: 'Search', onClick: () => setOpenPanel('search') },
    { icon: LocateFixed, label: 'GPS', onClick: toggleGps, active: gpsOn },
    { icon: BookOpen, label: 'Brochure', onClick: hasBrochure ? () => setOpenPanel('brochure') : null },
    { icon: Info, label: 'Info', onClick: () => setOpenPanel('info') },
    { icon: Navigation, label: 'Locate', href: directionsUrl(project.location) },
  ]

  return (
    <main className="relative h-svh overflow-hidden bg-base">
      <MapView
        project={mapProject}
        colorMode={colorMode}
        selectedPlot={selectedPlot}
        selectedBlock={selectedBlock}
        onSelectPlot={selectPlot}
        onSelectBlock={selectBlock}
        userPosition={userPosition}
        onShare={share}
        sidePanelOpen={sidePanelOpen}
      />

      {blocks.length > 0 && (
        <div className="absolute top-44 left-5 md:top-5 md:left-1/2 md:-translate-x-1/2">
          <BlockChips blocks={blocks} selected={selectedBlock} onSelect={selectBlock} />
        </div>
      )}

      <header className="absolute top-5 left-5">
        <h1 className="text-2xl font-bold tracking-wider uppercase drop-shadow md:text-3xl">{project.name}</h1>
        <p className="text-xs text-white/70">
          {project.city}
          {project.layout.sample && <span className="ml-2 rounded bg-hold/80 px-1.5 text-[10px] font-bold text-black uppercase">Sample layout</span>}
        </p>
      </header>

      {colorMode === 'status' && (
        <ul
          className={`absolute top-5 flex flex-col gap-1 rounded-lg bg-black/60 p-2 text-xs backdrop-blur transition-[right] ${
            sidePanelOpen ? 'right-5 md:right-104' : 'right-5'
          }`}
        >
          {Object.entries(STATUS_SWATCH).map(([status, swatch]) => (
            <li key={status} className="flex items-center gap-2 capitalize">
              <span className={`size-3 rounded-sm ${swatch}`} /> {status}
            </li>
          ))}
        </ul>
      )}

      <div
        className={`absolute bottom-5 left-5 flex flex-col items-stretch gap-2 transition-[right] md:left-auto md:items-end ${
          sidePanelOpen ? 'right-5 md:right-104' : 'right-5'
        }`}
      >
        <div className="flex flex-wrap justify-end gap-2">
          <Toggle label="Zones" on={colorMode === 'zones'} onChange={() => setColorMode(colorMode === 'zones' ? 'plain' : 'zones')} />
          <Toggle label="Status" on={colorMode === 'status'} onChange={() => setColorMode(colorMode === 'status' ? 'plain' : 'status')} />
          <a href={whatsappLink} target="_blank" rel="noreferrer" className={`${PILL} hover:bg-line`}>
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
            const className = `${PILL} ${enabled ? 'cursor-pointer hover:bg-line' : 'cursor-not-allowed opacity-40'} ${active ? 'text-brand' : ''}`
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
        selectedPlot.plan ? (
          <FlatPanel
            project={project}
            plot={selectedPlot}
            units={towerUnits[selectedPlot.number] ?? NO_UNITS}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            showStatus={colorMode === 'status'}
            enquiryLink={enquiryLink}
            onClose={() => setSelectedPlot(null)}
          />
        ) : selectedPlot.kind === 'amenity' ? (
          <AmenityPanel project={project} plot={selectedPlot} onClose={() => setSelectedPlot(null)} />
        ) : (
          <PlotCard project={project} plot={selectedPlot} showStatus={colorMode === 'status'} onClose={() => setSelectedPlot(null)} />
        )
      )}
      {blockPanelOpen && !openPanel && (
        <BlockPanel
          project={project}
          block={selectedBlock}
          units={units.filter((unit) => unit.block === selectedBlock)}
          onSelectUnit={selectUnitInTower}
          onClose={() => setSelectedBlock(null)}
        />
      )}
      {openPanel === 'search' && <SearchPanel project={project} onSelect={selectPlot} onClose={() => setOpenPanel(null)} />}
      {openPanel === 'info' && <InfoPanel project={project} onClose={() => setOpenPanel(null)} />}
      {openPanel === 'gallery' && (
        <GalleryViewer items={gallery} title={project.name} onClose={() => setOpenPanel(null)} />
      )}
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
