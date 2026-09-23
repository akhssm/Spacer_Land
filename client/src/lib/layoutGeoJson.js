// Turns a project's layout into GeoJSON the map can draw in one go.
// Each plot becomes a Feature whose properties carry its colour and label.

const PLAIN_FILL = '#eadfba'
const STATUS_FILL = { available: '#2f9e6b', sold: '#d9534f', hold: '#e0a02f', reserved: '#3f83d1' }
const ZONE_FILLS = ['#eadfba', '#b9dba9', '#f3c6a0', '#a9c8e8', '#d9b8e8']
const DEFAULT_HEIGHT_METRES = 3

function fillFor(plot, colorMode, zones) {
  if (colorMode === 'status') return STATUS_FILL[plot.status]
  if (colorMode === 'zones') return ZONE_FILLS[zones.indexOf(plot.zone) % ZONE_FILLS.length]
  return PLAIN_FILL
}

export function buildLayoutGeoJson(project, colorMode, selectedPlot) {
  const { boundary, plots } = project.layout
  const labelColour = colorMode === 'status' ? '#ffffff' : '#3b3a2a'

  const features = plots.map((plot) => ({
    type: 'Feature',
    properties: {
      kind: 'plot',
      number: plot.number,
      fill: fillFor(plot, colorMode, project.zones),
      selected: selectedPlot?.number === plot.number,
      height: project.unitHeight ?? DEFAULT_HEIGHT_METRES,
      labelColour,
    },
    geometry: { type: 'Polygon', coordinates: [plot.polygon] },
  }))

  if (boundary) {
    features.unshift({
      type: 'Feature',
      properties: { kind: 'boundary' },
      geometry: { type: 'Polygon', coordinates: [boundary] },
    })
  }

  return { type: 'FeatureCollection', features }
}
