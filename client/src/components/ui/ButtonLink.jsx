const BASE =
  'inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-bold transition-colors'

const VARIANTS = {
  primary: 'bg-brand text-[#0f0f0f] hover:bg-brand-dark',
  dark: 'border border-line bg-[#0f0f0f] text-white hover:border-brand',
}

// A link that looks like a button. One place to change every button on the site.
function ButtonLink({ href, variant = 'primary', children, ...rest }) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]}`} {...rest}>
      {children}
    </a>
  )
}

export default ButtonLink
