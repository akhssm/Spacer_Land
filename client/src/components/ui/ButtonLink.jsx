const BASE =
  'inline-flex items-center justify-center gap-2 rounded px-6 py-3 text-sm font-bold transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0'

// The lime button lifts, brightens and glows on hover, like the original
const VARIANTS = {
  primary: 'bg-brand text-[#0f0f0f] hover:-translate-y-0.5 hover:brightness-108 hover:shadow-[0_10px_28px_rgba(117,194,23,0.35)]',
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
