import { STATUSES } from '../../data/homeContent'

// A made-up layout drawn with SVG, so the hero needs no image file.
// Each block is a grid of plots; the gaps between blocks are the roads.
const PLOT_WIDTH = 48
const PLOT_HEIGHT = 54
const GAP = 4

const BLOCKS = [
  { x: 20, y: 20, cols: 5, rows: 2 },
  { x: 300, y: 20, cols: 4, rows: 2 },
  { x: 20, y: 168, cols: 5, rows: 2 },
  { x: 300, y: 168, cols: 4, rows: 2 },
  { x: 20, y: 316, cols: 5, rows: 1 },
]

// One letter per plot, in order: a = available, s = sold, h = hold, r = reserved
const STATUS_PATTERN = 'asaahasraasaashaarasaaasahsaraasaahsasaar'
const STATUS_BY_LETTER = { a: 'available', s: 'sold', h: 'hold', r: 'reserved' }

const HIGHLIGHTED_PLOT = 22

function buildPlots() {
  const plots = []

  BLOCKS.forEach((block) => {
    for (let row = 0; row < block.rows; row++) {
      for (let col = 0; col < block.cols; col++) {
        const index = plots.length
        plots.push({
          number: index + 1,
          x: block.x + col * PLOT_WIDTH,
          y: block.y + row * PLOT_HEIGHT,
          status: STATUS_BY_LETTER[STATUS_PATTERN[index]],
        })
      }
    }
  })

  return plots
}

const PLOTS = buildPlots()

function PlotIllustration() {
  return (
    <div className="illustration">
      <div className="illustration__board">
        <svg viewBox="0 0 512 386" role="img" aria-label="Sample plot layout coloured by status">
          <rect x="4" y="4" width="504" height="378" rx="18" className="illustration__land" />

          {/* Roads */}
          <rect x="4" y="130" width="504" height="32" className="illustration__road" />
          <rect x="4" y="278" width="504" height="32" className="illustration__road" />
          <rect x="264" y="4" width="32" height="378" className="illustration__road" />
          <line x1="12" y1="146" x2="500" y2="146" className="illustration__lane" />
          <line x1="12" y1="294" x2="500" y2="294" className="illustration__lane" />
          <line x1="280" y1="12" x2="280" y2="374" className="illustration__lane" />

          {/* Park in the last block */}
          <rect x="300" y="316" width="188" height="50" rx="6" className="illustration__park" />
          <circle cx="330" cy="341" r="11" className="illustration__tree" />
          <circle cx="394" cy="337" r="13" className="illustration__tree" />
          <circle cx="456" cy="343" r="10" className="illustration__tree" />

          {PLOTS.map((plot) => (
            <g key={plot.number}>
              <rect
                x={plot.x}
                y={plot.y}
                width={PLOT_WIDTH - GAP}
                height={PLOT_HEIGHT - GAP}
                rx="5"
                className={
                  plot.number === HIGHLIGHTED_PLOT
                    ? `plot plot--${plot.status} plot--active`
                    : `plot plot--${plot.status}`
                }
              />
              <text
                x={plot.x + (PLOT_WIDTH - GAP) / 2}
                y={plot.y + (PLOT_HEIGHT - GAP) / 2 + 4}
                className="plot__number"
              >
                {plot.number}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Info card like the one the real viewer will show on click */}
      <div className="illustration__card">
        <p className="illustration__card-title">Plot {HIGHLIGHTED_PLOT}</p>
        <p className="illustration__card-row">
          <span>Area</span> 1,800 sq.ft
        </p>
        <p className="illustration__card-row">
          <span>Facing</span> East
        </p>
        <p className="status-pill status-pill--available">Available</p>
      </div>

      <ul className="legend">
        {STATUSES.map((status) => (
          <li key={status.key}>
            <span className={`legend__dot legend__dot--${status.key}`} />
            {status.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PlotIllustration
