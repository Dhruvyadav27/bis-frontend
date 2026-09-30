import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Server,
  CheckSquare,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Scale,
  Gem,
} from 'lucide-react'
import bisLogo from '../assets/bis-smart-assist-logo.png'
import { useAuthStore } from '../store/authStore'

const ADMIN_NAV_ITEMS = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/standards', label: 'Manage Standards', icon: BookOpen },
  { to: '/admin/schemes', label: 'Manage Schemes', icon: Award },
  { to: '/admin/services', label: 'Manage Services', icon: Server },
  { to: '/admin/consumer-rules', label: 'Consumer Rules', icon: Scale },
  { to: '/admin/huid-records', label: 'HUID Records', icon: Gem },
  { to: '/admin/flagged-answers', label: 'Review AI Answers', icon: CheckSquare },
  { to: '/admin/consumer-trends', label: 'Consumer Query Trends', icon: TrendingUp },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Extract breadcrumb label from current pathname
  const currentItem = ADMIN_NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))
  const currentPageTitle = currentItem?.label || 'Administration'

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-900 text-white shadow-md">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Left: Mobile Toggle + Logo + Portal Title + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded p-1 text-slate-400 hover:text-white md:hidden"
              aria-label="Toggle admin navigation"
            >
              <Menu size={20} />
            </button>

            <Link to="/admin/overview" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center rounded-lg bg-white px-2 py-1 shadow-xs">
                <img src={bisLogo} alt="Bureau of Indian Standards" className="h-7 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-poppins text-sm font-bold tracking-tight text-white">
                    BIS Admin Portal
                  </span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400 uppercase">
                    SIH 26107
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  National Standardization & Compliance Directorate
                </span>
              </div>
            </Link>

            {/* Breadcrumb separator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-6 text-xs text-slate-400 border-l border-slate-800 ml-4">
              <span>Admin</span>
              <ChevronRight size={13} className="text-slate-600" />
              <span className="text-white font-medium">{currentPageTitle}</span>
            </div>
          </div>

          {/* Right: Exit to App + User Info + Logout */}
          <div className="flex items-center gap-3">
            {/* Exit to Public/Client App */}
            <Link
              to="/app/home"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Exit to</span>
              <span>App</span>
            </Link>

            {/* Admin Profile Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-none">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  SUPER ADMIN
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              title="Sign Out"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Admin Sidebar (~240px, Dark-themed slate for clear visual isolation) */}
        <aside className="hidden md:flex w-60 flex-col shrink-0 border-r border-slate-800 bg-slate-900 py-5">
          <div className="px-4 pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Control Center
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 font-semibold border-l-4 border-emerald-500 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border-l-4 border-transparent'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4 mt-auto">
            <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck size={14} />
                <span>Audited Environment</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                All modifications to standards and schemes are logged with dual-admin verification.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Admin Sidebar */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex w-64 flex-col bg-slate-900 p-4 text-white shadow-2xl z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <span className="font-poppins text-xs font-bold text-white">Admin Control</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="space-y-1">
                {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600/20 text-emerald-400 font-semibold border-l-4 border-emerald-500'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Admin Content Area (Notice: NO FloatingAssistantWidget here!) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
