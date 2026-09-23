// Sample projects, in the shape the Project model will have in MongoDB (Milestone 2).
// Every coordinate is in GeoJSON order: [longitude, latitude].

import {
  IRA_TOWERS_AMENITIES,
  IRA_TOWERS_BOUNDARY,
  IRA_TOWERS_OVERLAY,
  IRA_TOWERS_PLOTS,
} from './iraTowersLayout'

// Rough metres per degree around Hyderabad, used to draw sample shapes
const METRES_PER_DEG_LAT = 111_000
const METRES_PER_DEG_LNG = 106_000

// A closed rectangle whose top-left corner is at [lng, lat]
function rectangle([lng, lat], widthMetres, depthMetres) {
  const east = lng + widthMetres / METRES_PER_DEG_LNG
  const south = lat - depthMetres / METRES_PER_DEG_LAT
  return [
    [lng, lat],
    [east, lat],
    [east, south],
    [lng, south],
    [lng, lat],
  ]
}

const STATUS_BY_LETTER = { a: 'available', s: 'sold', h: 'hold', r: 'reserved' }

// A block of equal plots laid out in rows and columns
function makeBlock({ startNumber, origin, rows, cols, width, depth, zone, statusPattern }) {
  const plots = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = plots.length
      const corner = [
        origin[0] + (col * width) / METRES_PER_DEG_LNG,
        origin[1] - (row * depth) / METRES_PER_DEG_LAT,
      ]
      plots.push({
        number: String(startNumber + index),
        zone,
        status: STATUS_BY_LETTER[statusPattern[index % statusPattern.length]],
        polygon: rectangle(corner, width, depth),
      })
    }
  }
  return plots
}

const GREEN_MEADOWS_ORIGIN = [78.135, 17.455]

export const PROJECTS = [
  {
    shortCode: 'ira-towers',
    name: 'Ira Towers',
    type: 'apartments',
    unitLabel: 'Flat',
    unitHeight: 40, // metres, used when the map is tilted into 3D
    city: 'Hyderabad',
    address: 'G96J+J2V, ASR Nagar, Nizampet, Hyderabad, Telangana 500090',
    description:
      'Luxury high-rise 2 & 3 BHK apartments by V4 Ventures in ASR Nagar, Nizampet: three blocks with 36 flats per floor and an 18,648 sq.ft clubhouse.',
    location: [78.380047, 17.511612], // decoded from the plus code G96J+J2V
    whatsapp: '',
    zones: ['Block A', 'Block B', 'Block C', 'Amenities'],
    brochure: {
      // 24 pages rendered from the PDF with scripts/brochure-pages.py
      pages: Array.from({ length: 24 }, (_, index) => `/projects/ira-towers/brochure/page-${index + 1}.webp`),
    },
    layout: {
      // Traced from the brochure's master plan and fitted to the satellite image
      sample: false,
      overlay: IRA_TOWERS_OVERLAY, // the plan drawing itself, draped over the map
      boundary: IRA_TOWERS_BOUNDARY,
      plots: [...IRA_TOWERS_PLOTS, ...IRA_TOWERS_AMENITIES],
    },
  },
  {
    shortCode: 'demo',
    name: 'Green Meadows',
    type: 'plots',
    unitLabel: 'Plot',
    unitHeight: 3,
    city: 'Hyderabad',
    address: 'Near Shankarpally, Ranga Reddy district, Telangana',
    description: 'A sample plotted layout with 24 plots in two blocks, used to show every viewer feature.',
    location: [78.1355, 17.4547],
    whatsapp: '',
    zones: ['Block A', 'Block B'],
    brochure: {
      // One image per page. Real brochures will be PDFs converted to page images on the server.
      pages: Array.from({ length: 8 }, (_, index) => `/sample/brochure/page-${index + 1}.svg`),
    },
    layout: {
      sample: true,
      boundary: rectangle([78.13485, 17.45515], 120, 70),
      plots: [
        ...makeBlock({
          startNumber: 1,
          origin: GREEN_MEADOWS_ORIGIN,
          rows: 3,
          cols: 4,
          width: 12,
          depth: 18,
          zone: 'Block A',
          statusPattern: 'aasahaarsaaa',
        }),
        ...makeBlock({
          startNumber: 13,
          origin: [GREEN_MEADOWS_ORIGIN[0] + 57 / METRES_PER_DEG_LNG, GREEN_MEADOWS_ORIGIN[1]], // 9 m road gap
          rows: 3,
          cols: 4,
          width: 12,
          depth: 18,
          zone: 'Block B',
          statusPattern: 'saaraahasaas',
        }),
      ],
    },
  },
]

export function getProject(shortCode) {
  return PROJECTS.find((project) => project.shortCode === shortCode)
}
