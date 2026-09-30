import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, ChevronRight, ArrowLeft } from 'lucide-react'

const ROUTE_MAP = {
  '/about': [
    { label: 'About Us', path: '/about' },
  ],
  '/services': [
    { label: 'Digital Services', path: '/services' },
  ],
  '/contact': [
    { label: 'Contact Us', path: '/contact' },
  ],
  '/standard-finder': [
    { label: 'Services', path: '/services' },
    { label: 'Standard Finder', path: '/standard-finder' },
  ],
  '/certification-guide': [
    { label: 'Services', path: '/services' },
    { label: 'Certification Guide', path: '/certification-guide' },
  ],
  '/hallmarking': [
    { label: 'Services', path: '/services' },
    { label: 'Hallmarking & HUID', path: '/hallmarking' },
  ],
  '/find-lab': [
    { label: 'Services', path: '/services' },
    { label: 'Find a Lab', path: '/find-lab' },
  ],
  '/consumer-affairs': [
    { label: 'Services', path: '/services' },
    { label: 'Consumer Affairs', path: '/consumer-affairs' },
  ],
  '/process-guide': [
    { label: 'Services', path: '/services' },
    { label: 'Process Guide', path: '/process-guide' },
  ],
  '/tour': [
    { label: 'Interactive Tour', path: '/tour' },
  ],
}

function resolveBreadcrumbs(pathname, customItems) {
  if (customItems && customItems.length > 0) {
    return customItems
  }

  if (ROUTE_MAP[pathname]) {
    return ROUTE_MAP[pathname]
  }

  // Dynamic fallback: Split path segments for any nested routes
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = []
  let cumulative = ''

  for (let i = 0; i < segments.length; i++) {
    cumulative += `/${segments[i]}`
    if (ROUTE_MAP[cumulative]) {
      const mapped = ROUTE_MAP[cumulative]
      crumbs.push(mapped[mapped.length - 1])
    } else {
      const label = segments[i]
        .replace(/-/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      crumbs.push({ label, path: cumulative })
    }
  }

  return crumbs
}

export default function Breadcrumbs({ items, className = '', showOnHome = false }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Do not show on home or tour unless explicitly forced
  if ((location.pathname === '/' || location.pathname === '' || location.pathname === '/tour') && !showOnHome) {
    return null
  }

  const breadcrumbs = resolveBreadcrumbs(location.pathname, items)

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null
  }

  return (
    <div className={`border-b border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-xs ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Quick back button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors mr-2 pr-2.5 border-r border-slate-300/80 cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>

            {/* Home link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-700 transition-colors font-medium group"
            >
              <Home size={13} className="shrink-0 text-slate-400 group-hover:text-primary-600 transition-colors" />
              <span>Home</span>
            </Link>

            {/* Breadcrumb segments */}
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <div key={crumb.path || index} className="inline-flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-slate-400 shrink-0" />
                  {isLast ? (
                    <span
                      className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-none"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="text-slate-500 hover:text-primary-700 hover:underline transition-colors font-medium truncate max-w-[150px] sm:max-w-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>BIS Regulatory Portal • SIH 26107</span>
          </div>
        </nav>
      </div>
    </div>
  )
}
