import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react'
import { PageFlip } from 'page-flip'

// Below twice this width the book shows one page at a time instead of a spread
const MIN_PAGE_WIDTH = 320
const STAGE_MARGIN_X = 32
const STAGE_MARGIN_Y = 140

const ICON_BUTTON =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent'

// Builds one <div><img/></div> per page. page-flip takes over these elements,
// so they are created with plain DOM calls instead of JSX to keep React out of it.
function createPageElements(pages) {
  return pages.map((src, index) => {
    const page = document.createElement('div')
    page.dataset.density = index === 0 || index === pages.length - 1 ? 'hard' : 'soft'

    const image = document.createElement('img')
    image.src = src
    image.alt = `Page ${index + 1}`
    image.draggable = false
    image.className = 'block size-full select-none pointer-events-none'
    page.appendChild(image)
    return page
  })
}

// Full-screen overlay that shows brochure pages as a book you can flip through.
function BrochureViewer({ pages, title, onClose }) {
  const overlayRef = useRef(null)
  const bookRef = useRef(null)
  const flipRef = useRef(null)

  const [pageSize, setPageSize] = useState(null) // natural size of the first page image
  const [stageSize, setStageSize] = useState(null) // how big the book can be on this screen
  const [current, setCurrent] = useState(0)
  const [orientation, setOrientation] = useState('landscape')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 1. Measure the first page, so pages of any shape keep their proportions
  useEffect(() => {
    const image = new Image()
    image.onload = () => setPageSize({ width: image.naturalWidth, height: image.naturalHeight })
    image.src = pages[0]
  }, [pages])

  // 2. Fit the book to the window, and refit whenever the window changes size
  useEffect(() => {
    if (!pageSize) return

    const fit = () => {
      const ratio = pageSize.width / pageSize.height
      const availableWidth = window.innerWidth - STAGE_MARGIN_X
      const availableHeight = window.innerHeight - STAGE_MARGIN_Y
      const singlePage = availableWidth < MIN_PAGE_WIDTH * 2
      const bookRatio = singlePage ? ratio : ratio * 2
      const width = Math.min(availableWidth, availableHeight * bookRatio)
      setStageSize({ width, height: width / bookRatio })
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [pageSize])

  // 3. Create the book once the stage has a size
  const ready = Boolean(stageSize)
  useEffect(() => {
    if (!ready) return

    const book = bookRef.current
    const pageElements = createPageElements(pages)
    pageElements.forEach((page) => book.appendChild(page))

    const flip = new PageFlip(book, {
      size: 'stretch',
      width: pageSize.width,
      height: pageSize.height,
      minWidth: MIN_PAGE_WIDTH,
      maxWidth: 2000,
      minHeight: 100,
      maxHeight: 4000,
      showCover: true, // first and last page act as a hard cover
      usePortrait: true, // one page at a time on narrow screens
      maxShadowOpacity: 0.5,
      flippingTime: 700,
      mobileScrollSupport: false,
    })
    flip.loadFromHTML(pageElements)
    flip.on('flip', (event) => setCurrent(event.data))
    flip.on('changeOrientation', (event) => setOrientation(event.data))
    setOrientation(flip.getOrientation())
    flipRef.current = flip

    return () => {
      flip.destroy()
      flipRef.current = null
      book.replaceChildren()
    }
  }, [ready, pageSize, pages])

  // 4. Tell the book to re-measure itself after the stage is resized
  useEffect(() => {
    flipRef.current?.update()
  }, [stageSize])

  // Keyboard: arrows turn pages, Escape closes
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') flipRef.current?.flipNext()
      if (event.key === 'ArrowLeft') flipRef.current?.flipPrev()
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Stop the page behind the overlay from scrolling while it is open
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Keep the fullscreen button in sync when the user presses Esc to leave fullscreen
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      overlayRef.current?.requestFullscreen()
    }
  }

  const pageCount = pages.length
  const canUseFullscreen = document.fullscreenEnabled

  // A closed book shows one cover on its own. Shift the book by half a page so
  // that cover sits in the middle instead of leaving an empty half beside it.
  let coverShift = '0px'
  if (orientation === 'landscape') {
    if (current === 0) coverShift = '-25%'
    else if (current >= pageCount - 1) coverShift = '25%'
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} brochure`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white select-none"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <p className="text-sm text-white/70">
          {title} <span className="mx-1 text-white/30">·</span> Brochure
        </p>
        <button type="button" onClick={onClose} aria-label="Close brochure" className={ICON_BUTTON}>
          <X size={24} strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4">
        {/* page-flip draws the book inside this element */}
        <div
          ref={bookRef}
          style={{ ...stageSize, '--cover-shift': coverShift }}
          className="brochure-book"
        />
        {!ready && <p className="absolute text-sm text-white/60">Loading brochure…</p>}
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-xs text-white/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => flipRef.current?.flipPrev()}
            disabled={current === 0}
            aria-label="Previous page"
            className={ICON_BUTTON}
          >
            <ChevronLeft size={22} />
          </button>
          <span aria-live="polite" className="min-w-24 text-center tabular-nums">
            Page {current + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => flipRef.current?.flipNext()}
            disabled={current >= pageCount - 1}
            aria-label="Next page"
            className={ICON_BUTTON}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <span className="hidden md:inline">Click a page, use the arrow keys or swipe to turn pages</span>

        {canUseFullscreen ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
            className={ICON_BUTTON}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        ) : (
          <span className="size-11" />
        )}
      </div>
    </div>
  )
}

export default BrochureViewer
