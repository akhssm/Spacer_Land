import { SITE } from '../../data/homeContent'

// Small plot-grid mark plus the site name. Used in the navbar and footer.
function Logo() {
  return (
    <a href="#top" className="logo" aria-label={`${SITE.name} home`}>
      <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
        <rect x="1" y="1" width="12" height="12" rx="3" className="logo__plot" />
        <rect x="15" y="1" width="12" height="12" rx="3" className="logo__plot logo__plot--accent" />
        <rect x="1" y="15" width="12" height="12" rx="3" className="logo__plot" />
        <rect x="15" y="15" width="12" height="12" rx="3" className="logo__plot" />
      </svg>
      <span>{SITE.name}</span>
    </a>
  )
}

export default Logo
