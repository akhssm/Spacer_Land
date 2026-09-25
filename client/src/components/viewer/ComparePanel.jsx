import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Columns3, MessageCircle, X } from 'lucide-react'
import { SQ_FT_PER_SQ_M, formatArea } from '../../lib/geo'
import { STATUS_BG, STATUS_LABEL, countByStatus } from '../../lib/inventory'
import { alignRooms } from '../../lib/rooms'

export const COMPARE_LIMIT = 3

const ICON_BUTTON =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white'

// The pill at the bottom of the map while flats are picked for comparison
export function CompareTray({ entries, shifted = false, onOpen, onClear }) {
  if (!entries.length) return null
  const names = entries.map((entry) => entry.unit?.number ?? entry.plot.number).join(', ')
  return (
    // Under the block chips on phones; just above the toolbar on desktop, moving
    // left with the other controls when a side panel is open
    <div
      className={`absolute top-56 right-5 left-5 z-20 flex items-center justify-between gap-1 rounded-full border border-brand/60 bg-panel/95 py-1 pr-1 pl-4 text-sm shadow-2xl backdrop-blur transition-[right] md:top-auto md:bottom-32 md:left-auto md:justify-start ${
        shifted ? 'md:right-104' : 'md:right-5'
      }`}
    >
      <span className="text-white/80">
        Comparing <span className="font-bold text-white">{names}</span>
      </span>
      <button
        type="button"
        onClick={onOpen}
        disabled={entries.length < 2}
        className="ml-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-[#0f0f0f] hover:bg-brand-dark disabled:cursor-default disabled:opacity-50"
      >
        <Columns3 size={14} /> {entries.length < 2 ? 'Pick one more' : 'Compare'}
      </button>
      <button type="button" onClick={onClear} aria-label="Clear comparison" className="cursor-pointer rounded-full p-2 text-muted hover:text-white">
        <X size={16} />
      </button>
    </div>
  )
}

// Best value in a row of numbers gets the lime mark
const best = (values, higherIsBetter = true) => {
  const numbers = values.filter((value) => typeof value === 'number')
  if (numbers.length < 2 || new Set(numbers).size === 1) return null
  return higherIsBetter ? Math.max(...numbers) : Math.min(...numbers)
}

// Full-screen table: one column per flat, one row per fact, rooms lined up by name.
export function ComparePanel({ project, entries, towerUnits, onChangeUnit, onRemove, enquiryLink, onClose }) {
  const [differencesOnly, setDifferencesOnly] = useState(false)

  const flats = entries.map((entry) => entry.plot)
  const roomRows = alignRooms(flats)
  const areas = flats.map((flat) => flat.areaSqFt ?? null)
  const bestArea = best(areas)

  // Each fact is a row: label, one cell per flat, and whether the cells differ
  const rows = [
    { label: 'Block', cells: flats.map((flat) => flat.zone) },
    { label: 'Type', cells: flats.map((flat) => flat.bhk ?? '—') },
    { label: 'Facing', cells: flats.map((flat) => flat.facing ?? '—') },
    {
      label: 'Floor',
      cells: entries.map((entry, column) => {
        const units = towerUnits[entry.plot.number]
        if (!units?.length) return '—'
        return (
          <select
            key={column}
            value={entry.unit?.number ?? ''}
            onChange={(event) => onChangeUnit(column, units.find((unit) => unit.number === event.target.value) ?? null)}
            className="w-full rounded-md border border-line bg-base px-2 py-1 text-xs"
          >
            <option value="">Any floor</option>
            {units.map((unit) => (
              <option key={unit.number} value={unit.number}>
                Floor {unit.floor} · {unit.number} · {STATUS_LABEL[unit.status]}
              </option>
            ))}
          </select>
        )
      }),
      compare: entries.map((entry) => entry.unit?.floor ?? ''),
    },
    {
      label: 'Status',
      cells: entries.map((entry, column) => {
        const status = entry.unit?.status
        if (!status) return <span key={column} className="text-muted">Pick a floor</span>
        return (
          <span key={column} className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${STATUS_BG[status]}`}>
            {STATUS_LABEL[status]}
          </span>
        )
      }),
      compare: entries.map((entry) => entry.unit?.status ?? ''),
    },
    {
      label: 'Area',
      cells: flats.map((flat, column) => {
        if (!flat.areaSqFt) return '—'
        const area = formatArea(flat.areaSqFt / SQ_FT_PER_SQ_M)
        return (
          <span key={column} className={flat.areaSqFt === bestArea ? 'font-bold text-brand' : ''}>
            {area.sqft}
            <span className="block text-xs font-normal text-muted">{area.sqyd} · {area.sqm}</span>
          </span>
        )
      }),
      compare: areas,
    },
    ...roomRows.map((row) => {
      const sqfts = row.cells.map((cell) => cell?.sqft ?? null)
      const bestSqft = best(sqfts)
      return {
        label: row.label,
        cells: row.cells.map((cell, column) => {
          if (!cell) return <span key={column} className="text-muted">—</span>
          return (
            <span key={column} className={cell.sqft != null && cell.sqft === bestSqft ? 'font-bold text-brand' : ''}>
              {cell.size}
              {cell.sqft != null && <span className="block text-xs font-normal text-muted">{cell.sqft} sq.ft</span>}
            </span>
          )
        }),
        compare: row.cells.map((cell) => cell?.size ?? ''),
      }
    }),
    {
      label: 'Availability',
      cells: entries.map((entry, column) => {
        const units = towerUnits[entry.plot.number]
        if (!units?.length) return '—'
        const counts = countByStatus(units)
        return (
          <span key={column}>
            <span className="font-bold">{counts.available}</span> of {units.length} floors available
            <span className="block text-xs text-muted">
              {counts.hold} hold · {counts.sold} sold · {counts.reserved} reserved
            </span>
          </span>
        )
      }),
      compare: entries.map((entry) => countByStatus(towerUnits[entry.plot.number] ?? []).available),
    },
  ]

  const visibleRows = differencesOnly
    ? rows.filter((row) => new Set((row.compare ?? row.cells).map(String)).size > 1)
    : rows

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Compare flats" className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <p className="text-sm text-white/70">
          {project.name} <span className="mx-1 text-white/30">·</span> Compare {entries.length} flats
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">
          <input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} className="accent-brand" />
          Differences only
        </label>
        <button type="button" onClick={onClose} aria-label="Close comparison" className={ICON_BUTTON}>
          <X size={24} strokeWidth={1.25} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 pb-6">
        <table className="mx-auto w-full max-w-5xl border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-[#0a0a0a]">
            <tr>
              <th className="w-32 p-2 text-left align-bottom text-xs font-bold tracking-[0.15em] text-muted uppercase">Flat</th>
              {entries.map((entry, column) => (
                <th key={column} className="min-w-52 p-2 text-left align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-bold">{entry.unit?.number ?? `${project.unitLabel} ${entry.plot.number}`}</p>
                      <p className="text-xs font-normal text-muted">
                        {entry.unit ? `${project.unitLabel} ${entry.plot.number} · floor ${entry.unit.floor}` : 'any floor'}
                      </p>
                    </div>
                    <button type="button" onClick={() => onRemove(column)} aria-label={`Remove ${entry.plot.number} from comparison`} className="cursor-pointer rounded-full p-1 text-muted hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  {entry.plot.plan && (
                    <a href={entry.plot.plan} target="_blank" rel="noreferrer" title="Open the plan full size">
                      <img src={entry.plot.plan} alt={`Floor plan of ${entry.plot.number}`} className="mt-2 h-44 w-full rounded-lg border border-line bg-white object-contain" />
                    </a>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th className="border-t border-line p-2 text-left align-top font-semibold text-white/85">{row.label}</th>
                {row.cells.map((cell, column) => (
                  <td key={column} className="border-t border-line p-2 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={entries.length + 1} className="p-6 text-center text-muted">These flats are identical on every row.</td>
              </tr>
            )}
            <tr>
              <td className="p-2" />
              {entries.map((entry, column) => {
                const name = entry.unit?.number ?? `${project.unitLabel} ${entry.plot.number}`
                const message = `Hi, I am interested in ${name} at ${project.name}: ${entry.plot.bhk}, ${entry.plot.facing} facing, ${entry.plot.areaSqFt} sq.ft.`
                return (
                  <td key={column} className="p-2">
                    <a href={enquiryLink(message)} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-[#0f0f0f] hover:bg-brand-dark">
                      <MessageCircle size={14} /> Enquire about {entry.unit?.number ?? entry.plot.number}
                    </a>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>,
    document.body,
  )
}
