import { useState } from 'react'
import { ExternalLink, Search, X } from 'lucide-react'
import { SQ_FT_PER_SQ_M, areaSqMetres, directionsUrl, formatArea } from '../../lib/geo'

const STATUS_PILL = {
  available: 'bg-available',
  sold: 'bg-sold',
  hold: 'bg-hold',
  reserved: 'bg-reserved',
}

// Shared frame for the small panels that slide in at the bottom-left
function Panel({ title, onClose, children }) {
  return (
    <aside className="absolute bottom-40 left-5 z-10 w-[calc(100%-2.5rem)] rounded-xl border border-line bg-[#141414]/95 p-4 text-sm backdrop-blur md:bottom-5 md:w-80">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="cursor-pointer rounded-full p-1 text-muted hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </aside>
  )
}

export function StatusPill({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white capitalize ${STATUS_PILL[status]}`}>
      {status}
    </span>
  )
}

// Details of the plot the visitor clicked or searched for
export function PlotCard({ project, plot, showStatus, onClose }) {
  const isAmenity = plot.kind === 'amenity'
  // Prefer the size printed on the plan (saleable area); otherwise measure the shape.
  // Amenities only get an area if the plan states one.
  const sqMetres = plot.areaSqFt ? plot.areaSqFt / SQ_FT_PER_SQ_M : isAmenity ? null : areaSqMetres(plot.polygon)
  const area = sqMetres && formatArea(sqMetres)

  return (
    <Panel title={isAmenity ? plot.number : `${project.unitLabel} ${plot.number}`} onClose={onClose}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-muted">
        <dt>Zone</dt>
        <dd className="text-white">{plot.zone}</dd>
        {showStatus && !isAmenity && (
          <>
            <dt>Status</dt>
            <dd>
              <StatusPill status={plot.status} />
            </dd>
          </>
        )}
        {area && (
          <>
            <dt>Area</dt>
            <dd className="text-white">
              {area.sqft}
              <span className="block text-xs text-muted">
                {area.sqyd} · {area.sqm}
              </span>
            </dd>
          </>
        )}
      </dl>
    </Panel>
  )
}

// Find a plot by its number or name
export function SearchPanel({ project, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const matches = project.layout.plots.filter((plot) =>
    plot.number.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Panel title="Search" onClose={onClose}>
      <label className="flex items-center gap-2 rounded-lg border border-line bg-base px-3 py-2">
        <Search size={16} className="text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`${project.unitLabel} number or amenity`}
          className="w-full bg-transparent outline-none placeholder:text-muted"
        />
      </label>
      <ul className="mt-3 max-h-56 overflow-y-auto">
        {matches.map((plot) => (
          <li key={plot.number}>
            <button
              type="button"
              onClick={() => onSelect(plot)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-white/5"
            >
              <span>{plot.kind === 'amenity' ? plot.number : `${project.unitLabel} ${plot.number}`}</span>
              <span className="text-xs text-muted">{plot.zone}</span>
            </button>
          </li>
        ))}
        {matches.length === 0 && <li className="px-2 py-1.5 text-muted">No match</li>}
      </ul>
    </Panel>
  )
}

// About the project
export function InfoPanel({ project, onClose }) {
  return (
    <Panel title={project.name} onClose={onClose}>
      <p className="text-xs tracking-wide text-muted uppercase">
        {project.type} · {project.city}
      </p>
      <p className="mt-3 leading-6 text-white/85">{project.description}</p>
      <p className="mt-3 text-muted">{project.address}</p>
      <p className="mt-1 text-muted">
        {project.layout.plots.length} {project.unitLabel.toLowerCase()}s · {project.zones.join(', ')}
      </p>
      <a
        href={directionsUrl(project.location)}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-brand hover:underline"
      >
        Open in Google Maps <ExternalLink size={14} />
      </a>
    </Panel>
  )
}
