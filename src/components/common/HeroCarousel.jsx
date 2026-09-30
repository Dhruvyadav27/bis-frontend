import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import carousel1 from '../../assets/smart-assist-carousel-1.png'
import carousel2 from '../../assets/smart-assist-carousel-2.png'
import carousel3 from '../../assets/smart-assist-carousel-3.png'

// The three uploaded BIS Smart Assist banners are used directly in this order.
const SLIDES = [carousel1, carousel2, carousel3]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  function goTo(i) {
    setIndex((i + SLIDES.length) % SLIDES.length)
  }

  return (
    <div className="relative w-full overflow-hidden bg-white border-b border-slate-200/80 shadow-xs group">
      <div className="relative w-full overflow-hidden bg-white" style={{ aspectRatio: '2.66 / 1' }}>
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0 flex items-center justify-center bg-white"
            >
              <img
                src={src}
                alt={`BIS Smart Assist banner slide ${i + 1}`}
                className="h-full w-full object-contain object-center select-none"
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
        className="absolute left-3 sm:left-6 top-1/2 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-primary hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
        className="absolute right-3 sm:right-6 top-1/2 flex h-9 w-9 sm:h-11 sm:w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-primary hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/35 px-3 py-1.5 backdrop-blur-md border border-white/30 shadow-xs">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
