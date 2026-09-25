// Builds the sellable units of a project from its blocks and flat positions.

// "B-06" on floor 6 becomes "B-606"; "C-12A" on floor 10 becomes "C-1012A"
export function unitNumber(tower, floor) {
  const dash = tower.indexOf('-')
  const prefix = dash === -1 ? '' : tower.slice(0, dash + 1)
  const flat = dash === -1 ? tower : tower.slice(dash + 1)
  return `${prefix}${floor}${flat}`
}

// One unit per flat position per floor, for every block that has floors.
// statusFor(tower, floor) decides each unit's starting status.
export function buildUnits(projectId, blocks, plots, statusFor = () => 'available') {
  const units = []
  for (const block of blocks) {
    const floors = block.floors ?? 0
    const towers = plots.filter((plot) => plot.kind !== 'amenity' && plot.zone === block.name)
    for (const tower of towers) {
      for (let floor = 1; floor <= floors; floor++) {
        units.push({
          project: projectId,
          block: block.name,
          tower: tower.number,
          floor,
          number: unitNumber(tower.number, floor),
          status: statusFor(tower.number, floor),
        })
      }
    }
  }
  return units
}
