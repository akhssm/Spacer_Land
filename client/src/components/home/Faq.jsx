import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQS } from '../../data/homeContent'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

const COLLAPSED_COUNT = 5

function Faq() {
  const [showAll, setShowAll] = useState(false)

  const visibleFaqs = showAll ? FAQS : FAQS.slice(0, COLLAPSED_COUNT)

  return (
    <section id="faq" className="bg-panel px-5 py-20">
      <div className="mx-auto w-full max-w-215">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" center />

        <Reveal>
          <div className="relative space-y-3">
            {visibleFaqs.map((faq) => (
              // <details> opens and closes by itself, so it needs no React state
              <details key={faq.question} className="group rounded-lg border border-line bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-sm leading-6 text-muted">{faq.answer}</p>
              </details>
            ))}

            {/* Fades out the last visible question to hint that there are more */}
            {!showAll && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-panel to-transparent" />
            )}
          </div>

          {FAQS.length > COLLAPSED_COUNT && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="cursor-pointer text-xs text-muted underline underline-offset-4 hover:text-white"
              >
                {showAll ? 'Show less' : 'Show more'}
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default Faq
