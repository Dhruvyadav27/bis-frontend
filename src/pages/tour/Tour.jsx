import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  Search,
  Award,
  Scale,
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Compass,
  Building2,
  Users,
  FileCheck
} from 'lucide-react'
import bisLogo from '../../assets/bis-smart-assist-logo.png'

const NAVBAR_COLOR = 'rgb(6,76,76)'

const SLIDES = [
  {
    id: 'welcome',
    badge: '01 / 05',
    category: 'Institutional Mandate',
    title: 'Welcome to BIS Smart Assist',
    subtitle: 'National Standards Body of India • SIH 2026',
    desc: 'The official AI-backed statutory gateway for Indian Standards (IS), industrial licensing, and consumer product verification under the BIS Act, 2016.',
    icon: Shield,
    actionUrl: '/',
    actionLabel: 'Explore Dashboard'
  },
  {
    id: 'standards',
    badge: '02 / 05',
    category: 'Standardization Engine',
    title: 'Instant Indian Standard (IS) Discovery',
    subtitle: 'Natural Language Query Processing',
    desc: 'Describe any product in plain conversational language (e.g., "smart LED bulb" or "drinking water") to retrieve exact matching IS codes, testing parameters, and mandatory clauses.',
    icon: Search,
    actionUrl: '/standard-finder',
    actionLabel: 'Try Standard Finder'
  },
  {
    id: 'certification',
    badge: '03 / 05',
    category: 'Licensing & Conformity',
    title: 'Certification Scheme Guide',
    subtitle: 'ISI Mark, CRS & FMCS Schemes',
    desc: 'Discover your product\'s exact licensing pathway with diagnostic checklists, factory audit guidelines, fee schedules, and required documentation.',
    icon: Award,
    actionUrl: '/certification-guide',
    actionLabel: 'View Certification Guide'
  },
  {
    id: 'hallmarking',
    badge: '04 / 05',
    category: 'Consumer Protection',
    title: 'Gold Hallmarking & HUID Verification',
    subtitle: 'Real-time Purity & Center Authentication',
    desc: 'Verify 6-digit alphanumeric HUID codes to instantaneously inspect gold purity (22K916, 18K750), assaying center credentials, and guard against counterfeit jewelry.',
    icon: Scale,
    actionUrl: '/hallmarking',
    actionLabel: 'Verify Gold HUID'
  },
  {
    id: 'assistant',
    badge: '05 / 05',
    category: '24/7 AI Regulatory Copilot',
    title: 'Conversational Regulatory Copilot',
    subtitle: 'Zero Hallucinations • Source-Backed Answers',
    desc: 'Ask complex regulatory, testing, or licensing questions anytime. Grounded strictly in official BIS gazette publications, acts, and quality control orders.',
    icon: Bot,
    actionUrl: '/',
    actionLabel: 'Enter Home Platform'
  }
]

export default function Tour({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const finishTour = () => {
    navigate('/', { replace: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (onComplete) {
      onComplete()
    }
  }

  const nextSlide = () => {
    if (current < SLIDES.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      finishTour()
    }
  }

  const prevSlide = () => {
    setCurrent((c) => Math.max(0, c - 1))
  }

  const skipTour = () => {
    finishTour()
  }

  const activeSlide = SLIDES[current]
  const IconComponent = activeSlide.icon

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none -m-4 md:-m-8">
      {/* 1. Top Government of India Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-1.5 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Government of India • Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
          </div>
          <span className="hidden sm:inline text-emerald-400 font-semibold text-[11px]">
            Smart India Hackathon 2026 • SIH26107
          </span>
        </div>
      </div>

      {/* 2. Main Navbar in exact rgb(6,76,76) with white logo badge */}
      <header style={{ backgroundColor: NAVBAR_COLOR }} className="text-white shadow-md border-b border-black/10 z-20">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
              <img src={bisLogo} alt="Bureau of Indian Standards" className="h-8 w-auto object-contain" />
            </div>
            <div className="flex flex-col text-white leading-tight">
              <span className="font-poppins text-sm font-bold tracking-tight text-white">भारतीय मानक ब्यूरो</span>
              <span className="text-[10px] font-medium text-white/80 tracking-wider uppercase">Bureau of Indian Standards</span>
            </div>
          </div>
          <button
            type="button"
            onClick={skipTour}
            className="text-xs text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-3.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span>Skip to Platform</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* 3. Centerpiece Onboarding Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 md:py-6">
        {/* Dribbble-Style Card Carousel Container */}
        <div className="relative flex items-center justify-center pt-2 pb-4 min-h-[570px] overflow-hidden">
        {/* Previous Card Peek (Desktop) */}
        {current > 0 && (
          <div
            onClick={prevSlide}
            className="hidden md:flex flex-col justify-between absolute left-4 lg:left-12 w-[310px] h-[520px] bg-white/70 backdrop-blur-xs rounded-[36px] p-6 border border-slate-200/80 shadow-md opacity-50 scale-90 cursor-pointer hover:opacity-75 transition-all duration-300 z-10"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{SLIDES[current - 1].badge}</span>
              <span className="font-semibold">{SLIDES[current - 1].category}</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-sm">{SLIDES[current - 1].title}</p>
            </div>
            <div className="text-center text-xs text-slate-400">Click to return</div>
          </div>
        )}

        {/* Centerpiece Active Phone Card */}
        <div className="relative z-30 w-full max-w-[360px] sm:max-w-[390px] bg-white rounded-[40px] p-7 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-2xl h-[560px] transition-all duration-300">
          {/* Top Bar with Step Count & Skip */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span
              style={{ color: NAVBAR_COLOR, backgroundColor: 'rgba(6,76,76,0.08)' }}
              className="px-3 py-1 rounded-full font-bold text-[11px] border border-teal-800/20"
            >
              {activeSlide.badge}
            </span>
            <button
              type="button"
              onClick={skipTour}
              className="text-slate-400 hover:text-slate-700 font-semibold text-xs transition"
            >
              Skip
            </button>
          </div>

          {/* Graphic / Illustration Area matching user's Dribbble reference */}
          <div className="relative flex items-center justify-center my-4">
            {/* Concentric Layer Rings */}
            <div
              style={{ backgroundColor: 'rgba(6,76,76,0.05)', borderColor: 'rgba(6,76,76,0.15)' }}
              className="w-44 h-44 rounded-full border flex items-center justify-center relative"
            >
              <div
                style={{ backgroundColor: 'rgba(6,76,76,0.1)' }}
                className="w-32 h-32 rounded-full flex items-center justify-center"
              >
                <div
                  style={{ backgroundColor: NAVBAR_COLOR }}
                  className="w-20 h-20 rounded-full text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-200"
                >
                  <IconComponent size={34} className="text-amber-300" />
                </div>
              </div>

              {/* Orbiting Verification Emblems */}
              <span className="absolute top-2 right-3 w-7 h-7 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                ✓
              </span>
              <span className="absolute bottom-2 left-3 w-7 h-7 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-amber-500 text-xs font-bold">
                ★
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center px-2 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {activeSlide.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-poppins">
              {activeSlide.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              {activeSlide.desc}
            </p>
          </div>

          {/* Bottom Pagination Dots & Next / Finish CTA */}
          <div className="space-y-4 pt-3">
            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <span
                  key={idx}
                  style={idx === current ? { backgroundColor: NAVBAR_COLOR } : {}}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-6' : 'w-1.5 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Primary Action Button in rgb(6,76,76) */}
            <button
              type="button"
              onClick={nextSlide}
              style={{ backgroundColor: NAVBAR_COLOR }}
              className="w-full text-white font-bold py-3.5 rounded-2xl shadow-lg hover:opacity-95 transition-all transform active:scale-98 text-xs flex items-center justify-center gap-2"
            >
              <span>{current === SLIDES.length - 1 ? 'Get Started • Enter Platform' : 'Next'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Next Card Peek (Desktop) */}
        {current < SLIDES.length - 1 && (
          <div
            onClick={nextSlide}
            className="hidden md:flex flex-col justify-between absolute right-4 lg:right-12 w-[310px] h-[520px] bg-white/70 backdrop-blur-xs rounded-[36px] p-6 border border-slate-200/80 shadow-md opacity-50 scale-90 cursor-pointer hover:opacity-75 transition-all duration-300 z-10"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{SLIDES[current + 1].badge}</span>
              <span className="font-semibold">{SLIDES[current + 1].category}</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-sm">{SLIDES[current + 1].title}</p>
            </div>
            <div className="text-center text-xs text-slate-400">Click to advance</div>
          </div>
        )}
      </div>

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Step {current + 1} of {SLIDES.length}
        </span>
        <button
          type="button"
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Direct Quick-Launch Links to Specific Tools */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs max-w-xl mx-auto">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold text-slate-800">Quick-Jump to Specific Regulatory Tools:</span>
          <span className="text-[11px] text-slate-400">Direct Access</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <Link
            to="/standard-finder"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-100 font-semibold text-center transition"
          >
            Standard Finder
          </Link>
          <Link
            to="/certification-guide"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-100 font-semibold text-center transition"
          >
            Cert Schemes
          </Link>
          <Link
            to="/hallmarking"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-100 font-semibold text-center transition"
          >
            HUID Check
          </Link>
          <Link
            to="/find-lab"
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-100 font-semibold text-center transition"
          >
            Lab Directory
          </Link>
        </div>
      </div>
      </main>

      {/* 4. Footer */}
      <footer className="text-center py-3.5 text-xs text-slate-400 border-t border-slate-200/80 bg-white/70">
        Bureau of Indian Standards (BIS) • National Standards Body of India • SIH26107
      </footer>
    </div>
  )
}
