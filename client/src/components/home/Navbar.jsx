import { SITE } from '../../data/homeContent'
import ButtonLink from '../ui/ButtonLink'
import Logo from './Logo'

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-base/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-324 items-center justify-between px-5">
        <Logo showTagline />
        <ButtonLink href="#pricing">Buy {SITE.name}</ButtonLink>
      </div>
    </header>
  )
}

export default Navbar
