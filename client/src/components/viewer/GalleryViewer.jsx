import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'

const ICON_BUTTON =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent'

const youtubeThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`

// One item shown large: an image, or an embedded YouTube video
function Slide({ item }) {
  if (item.kind === 'youtube') {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${item.url}?autoplay=1&rel=0`}
        title={item.caption || 'Video'}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full max-w-5xl rounded-lg bg-black"
      />
    )
  }
  return (
    <img
      src={item.url}
      alt={item.caption}
      className="max-h-full max-w-full rounded-lg object-contain shadow-2xl select-none"
      draggable={false}
    />
  )
}

// Full-screen gallery: a grid of thumbnails, and a large view with arrows when one is chosen.
function GalleryViewer({ items, title, onClose, initialIndex = null }) {
  const [current, setCurrent] = useState(initialIndex) // index of the item shown large, or null for the grid

  const showPrev = () => setCurrent((index) => Math.max(index - 1, 0))
  const showNext = () => setCurrent((index) => Math.min(index + 1, items.length - 1))

  // Keyboard: arrows move between pictures, Escape goes back to the grid, then closes
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (current === null) onClose()
        else setCurrent(null)
      }
      if (current === null) return
      if (event.key === 'ArrowRight') setCurrent(Math.min(current + 1, items.length - 1))
      if (event.key === 'ArrowLeft') setCurrent(Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [current, onClose, items.length])

  // Stop the page behind the overlay from scrolling while it is open
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const item = current === null ? null : items[current]

  // Rendered at the document root, so it covers the whole screen even when
  // opened from inside a panel (a panel's backdrop-filter would otherwise trap it).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-sm text-white/70">
          {title} <span className="mx-1 text-white/30">·</span> Gallery
          {item && (
            <span className="ml-3 text-white/50">
              {current + 1} / {items.length}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={item ? () => setCurrent(null) : onClose}
          aria-label={item ? 'Back to all pictures' : 'Close gallery'}
          className={ICON_BUTTON}
        >
          <X size={24} strokeWidth={1.25} />
        </button>
      </div>

      {item ? (
        <>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-2">
            <button
              type="button"
              onClick={showPrev}
              disabled={current === 0}
              aria-label="Previous picture"
              className={`${ICON_BUTTON} absolute left-2`}
            >
              <ChevronLeft size={26} />
            </button>
            <Slide item={item} />
            <button
              type="button"
              onClick={showNext}
              disabled={current === items.length - 1}
              aria-label="Next picture"
              className={`${ICON_BUTTON} absolute right-2`}
            >
              <ChevronRight size={26} />
            </button>
          </div>
          <p className="px-4 pb-4 text-center text-sm text-white/80">{item.caption}</p>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((entry, index) => (
              <li key={entry.url}>
                <button
                  type="button"
                  onClick={() => setCurrent(index)}
                  className="group relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-lg bg-white/5"
                >
                  <img
                    src={entry.kind === 'youtube' ? youtubeThumb(entry.url) : entry.url}
                    alt={entry.caption}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {entry.kind === 'youtube' && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex size-12 items-center justify-center rounded-full bg-black/60">
                        <Play size={22} fill="currentColor" />
                      </span>
                    </span>
                  )}
                  {entry.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-6 pb-2 text-left text-xs">
                      {entry.caption}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>,
    document.body,
  )
}

export default GalleryViewer
