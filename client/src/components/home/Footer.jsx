import { NAV_LINKS, SITE, getContactLink } from '../../data/homeContent'
import Logo from './Logo'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>{SITE.tagline}</p>
        </div>

        <div className="footer__column">
          <h4>Product</h4>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer__column">
          <h4>Contact</h4>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={getContactLink()}>Book a demo</a>
        </div>
      </div>

      <p className="footer__copyright">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
