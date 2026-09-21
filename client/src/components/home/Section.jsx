// Shared wrapper so every section gets the same spacing and heading style.
function Section({ id, eyebrow, title, subtitle, tinted = false, children }) {
  return (
    <section id={id} className={tinted ? 'section section--tinted' : 'section'}>
      <div className="container">
        <header className="section__header">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {subtitle && <p className="section__subtitle">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}

export default Section
