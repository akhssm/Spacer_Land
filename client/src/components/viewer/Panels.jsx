import { useState } from 'react'
import { Compass, ExternalLink, MessageCircle, Search, X } from 'lucide-react'
import { SQ_FT_PER_SQ_M, areaSqMetres, directionsUrl, formatArea } from '../../lib/geo'

const CHIP =
  'inline-flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors'

// "All blocks / Block A / Block B / Block C" switcher
export function BlockChips({ blocks, selected, onSelect }) {
  const options = [{ name: null, label: 'All blocks' }, ...blocks.map((b) => ({ name: b.name, label: b.name }))]
  return (
    <div role="group" aria-label="Choose a block" className="flex flex-wrap gap-1.5">
      {options.map(({ name, label }) => {
        const active = selected === name
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(name)}
            aria-pressed={active}
            className={`${CHIP} ${
              active
                ? 'border-brand bg-brand text-[#0f0f0f]'
                : 'border-line bg-[#1c1c1c]/90 text-white backdrop-blur hover:border-brand'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// Everything about one flat: type, facing, area, its floor plan and every room's size
export function FlatPanel({ project, plot, showStatus, enquiryLink, onClose }) {
  const area = formatArea(plot.areaSqFt / SQ_FT_PER_SQ_M)
  const title = `${project.unitLabel} ${plot.number}`
  const message = `Hi, I am interested in ${title} (${plot.bhk}, ${plot.facing} facing, ${area.sqft}) at ${project.name}.`

  return (
    <aside
      aria-label={title}
      className="absolute inset-x-3 bottom-3 z-20 max-h-[75svh] overflow-y-auto rounded-xl border border-line bg-panel/95 p-5 text-sm backdrop-blur md:inset-x-auto md:top-20 md:right-5 md:bottom-5 md:max-h-none md:w-96"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-xs text-muted">
            {plot.zone} · {project.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="cursor-pointer rounded-full p-1 text-muted hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{plot.bhk}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
          <Compass size={12} /> {plot.facing} facing
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{area.sqft}</span>
        {showStatus && <StatusPill status={plot.status} />}
      </div>

      <a href={plot.plan} target="_blank" rel="noreferrer" title="Open the plan full size">
        <img
          src={plot.plan}
          alt={`Floor plan of ${title}`}
          className="w-full rounded-lg border border-line bg-white"
        />
      </a>
      <p className="mt-1.5 text-[11px] text-muted">Typical floor plan. Tap the plan to open it full size.</p>

      <h3 className="mt-5 mb-2 text-xs font-bold tracking-[0.15em] text-muted uppercase">Rooms</h3>
      <table className="w-full">
        <tbody>
          {plot.rooms.map((roomItem, index) => (
            <tr key={index} className="border-t border-line">
              <td className="py-1.5 pr-3 text-white/85">{roomItem.name}</td>
              <td className="py-1.5 text-right font-semibold tabular-nums">{roomItem.size}</td>
            </tr>
          ))}
          <tr className="border-t border-line">
            <td className="py-1.5 pr-3 text-white/85">Total area</td>
            <td className="py-1.5 text-right font-semibold">
              {area.sqft}
              <span className="block text-xs font-normal text-muted">
                {area.sqyd} · {area.sqm}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <a
        href={enquiryLink(message)}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-[#0f0f0f] hover:bg-brand-dark"
      >
        <MessageCircle size={16} /> Enquire about this flat
      </a>
    </aside>
  )
}

const STATUS_PILL = {
  available: 'bg-available',
  sold: 'bg-sold',
  hold: 'bg-hold',
  reserved: 'bg-reserved',
}

// Shared frame for the small panels that slide in at the bottom-left
function Panel({ title, onClose, children }) {
  return (
    <aside className="absolute bottom-40 left-5 z-10 w-[calc(100%-2.5rem)] rounded-xl border border-line bg-panel/95 p-4 text-sm backdrop-blur md:bottom-5 md:w-80">
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
