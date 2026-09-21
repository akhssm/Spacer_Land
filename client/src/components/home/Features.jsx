import { FEATURE_GROUPS } from '../../data/homeContent'
import Section from './Section'

function Features() {
  return (
    <Section
      id="features"
      tinted
      eyebrow="Features"
      title="Built for buyers and for the people selling"
      subtitle="Buyers get a clear picture of the site. Your team gets one place to keep it accurate."
    >
      {FEATURE_GROUPS.map((group) => (
        <div key={group.title} className="feature-group">
          <h3 className="feature-group__title">{group.title}</h3>
          <div className="grid grid--features">
            {group.features.map(({ icon: Icon, title, text }) => (
              <article key={title} className="feature">
                <span className="icon-badge icon-badge--small">
                  <Icon size={18} />
                </span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </Section>
  )
}

export default Features
