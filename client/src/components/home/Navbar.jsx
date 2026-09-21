import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS, getContactLink } from '../../data/homeContent'
import Logo from './Logo'

function Navbar() {
  // Only matters on phones, where the links hide behind a menu button
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />

        <nav
          id="main-nav"
          className={menuOpen ? 'navbar__links navbar__links--open' : 'navbar__links'}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className="btn btn--primary btn--small" href={getContactLink()} onClick={closeMenu}>
            Book a demo
          </a>
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}

export default Navbar
