// Helpers for the sellable units (a flat on one floor of one tower).

export const STATUS_ORDER = ['available', 'hold', 'sold', 'reserved']

export const STATUS_LABEL = { available: 'Available', hold: 'Hold', sold: 'Sold', reserved: 'Reserved' }

// Tailwind classes, written out so Tailwind can find them
export const STATUS_BG = {
  available: 'bg-available',
  hold: 'bg-hold',
  sold: 'bg-sold',
  reserved: 'bg-reserved',
}

export const emptyCounts = () => ({ available: 0, hold: 0, sold: 0, reserved: 0 })

export function countByStatus(units) {
  const counts = emptyCounts()
  units.forEach((unit) => {
    counts[unit.status] += 1
  })
  return counts
}

// { "B-06": [units sorted by floor, top floor first], ... }
export function unitsByTower(units) {
  const byTower = {}
  units.forEach((unit) => {
    ;(byTower[unit.tower] ??= []).push(unit)
  })
  Object.values(byTower).forEach((list) => list.sort((a, b) => b.floor - a.floor))
  return byTower
}

// The colour a tower gets on the map in status mode: the status most of its
// floors have. Ties go to the earlier entry in STATUS_ORDER.
export function towerStatus(units) {
  if (!units?.length) return null
  const counts = countByStatus(units)
  return STATUS_ORDER.reduce((best, status) => (counts[status] > counts[best] ? status : best))
}
