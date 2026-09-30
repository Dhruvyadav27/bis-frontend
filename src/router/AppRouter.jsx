import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ExternalLink, Shield, CheckCircle } from 'lucide-react'
import SiteHeader from '../components/common/SiteHeader'
import Breadcrumbs from '../components/common/Breadcrumbs'
import AdminLayout from '../layouts/AdminLayout'
import RequireRole from './RequireRole'
import bisLogo from '../assets/bis-smart-assist-logo.png'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import CompleteProfile from '../pages/auth/CompleteProfile'
import Home from '../pages/dashboard/Home'
import About from '../pages/about/About'
import Services from '../pages/services/Services'
import Contact from '../pages/contact/Contact'
import StandardFinder from '../pages/standardFinder/StandardFinder'
import CertificationGuide from '../pages/certificationGuide/CertificationGuide'
import Hallmarking from '../pages/hallmarking/Hallmarking'
import FindLab from '../pages/findLab/FindLab'
import ConsumerAffairs from '../pages/consumerAffairs/ConsumerAffairs'
import ProcessGuide from '../pages/processGuide/ProcessGuide'
import AiAssistant from '../pages/app/AiAssistant'
import Tour from '../pages/tour/Tour'
import { useAuthStore } from '../store/authStore'

// Admin panel pages — only reachable via /admin/*, gated by RequireRole below
import AdminOverview from '../pages/admin/Overview'
import ManageStandards from '../pages/admin/ManageStandards'
import ManageSchemes from '../pages/admin/ManageSchemes'
import ManageServices from '../pages/admin/ManageServices'
import ReviewAiAnswers from '../pages/admin/ReviewAiAnswers'
import ConsumerQueryTrends from '../pages/admin/ConsumerQueryTrends'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageConsumerRules from '../pages/admin/ManageConsumerRules'
import ManageHuidRecords from '../pages/admin/ManageHuidRecords'

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Institutional Intro */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
                <img src={bisLogo} alt="Bureau of Indian Standards" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <p className="font-poppins text-sm font-bold text-white leading-tight">भारतीय मानक ब्यूरो</p>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">Bureau of Indian Standards</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The National Standards Body of India, operating under the Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <Shield size={14} />
              <span>SIH 2026 Implementation • SIH26107</span>
            </div>
          </div>

          {/* Col 2: Digital Services */}
          <div>
            <p className="font-poppins text-xs font-semibold uppercase tracking-wider text-white">Digital Services</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/standard-finder" className="text-slate-400 hover:text-white transition-colors">
                  Standard Finder (IS Database)
                </Link>
              </li>
              <li>
                <Link to="/certification-guide" className="text-slate-400 hover:text-white transition-colors">
                  Certification Guide (ISI / CRS)
                </Link>
              </li>
              <li>
                <Link to="/hallmarking" className="text-slate-400 hover:text-white transition-colors">
                  Hallmarking &amp; HUID Verification
                </Link>
              </li>
              <li>
                <Link to="/find-lab" className="text-slate-400 hover:text-white transition-colors">
                  BIS-Recognised Testing Labs
                </Link>
              </li>
              <li>
                <Link to="/consumer-affairs" className="text-slate-400 hover:text-white transition-colors">
                  Consumer Protection &amp; Redressal
                </Link>
              </li>
              <li>
                <Link to="/process-guide" className="text-slate-400 hover:text-white transition-colors">
                  My Application Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <p className="font-poppins text-xs font-semibold uppercase tracking-wider text-white">Official Portals</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span>Manak Online Portal</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span>Official BIS Website</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://consumerhelpline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span>National Consumer Helpline</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span>National Portal of India</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpdesk */}
          <div>
            <p className="font-poppins text-xs font-semibold uppercase tracking-wider text-white">Central Helpdesk</p>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-primary-100 shrink-0 mt-0.5" />
                <span>Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi 110002</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <a href="tel:1800113011" className="hover:text-white transition-colors font-medium">
                  1800-11-3011 (Toll Free)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary-100 shrink-0" />
                <a href="mailto:info@bis.gov.in" className="hover:text-white transition-colors">
                  info@bis.gov.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row text-[11px] text-slate-500">
          <p>© 2026 Bureau of Indian Standards (BIS). All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Standardization • Certification • Consumer Empowerment</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div>
        <SiteHeader />
        <Breadcrumbs />
        <main className="mx-auto max-w-7xl p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/standard-finder" element={<StandardFinder />} />
            <Route path="/certification-guide" element={<CertificationGuide />} />
            <Route path="/hallmarking" element={<Hallmarking />} />
            <Route path="/find-lab" element={<FindLab />} />
            <Route path="/consumer-affairs" element={<ConsumerAffairs />} />
            <Route path="/process-guide" element={<ProcessGuide />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/tour" element={<Tour />} />
          </Routes>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

// Admin panel — fully isolated route tree. Its own layout (AdminLayout), no
// SiteHeader/SiteFooter/FloatingAssistantWidget, and gated by RequireRole so
// only an authenticated ADMIN account can ever reach these pages.
function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="standards" element={<ManageStandards />} />
        <Route path="schemes" element={<ManageSchemes />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="consumer-rules" element={<ManageConsumerRules />} />
        <Route path="huid-records" element={<ManageHuidRecords />} />
        <Route path="flagged-answers" element={<ReviewAiAnswers />} />
        <Route path="consumer-trends" element={<ConsumerQueryTrends />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>
    </Routes>
  )
}

export default function AppRouter() {
  const location = useLocation()
  const isAuthRoute = ['/login', '/register', '/complete-profile'].includes(location.pathname)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAuthRoute) return <AuthLayout />
  if (isAdminRoute) return <AdminRoutes />
  // Start every fresh/unauthenticated session on the login page instead of
  // auto-opening the onboarding tour or a previously cached demo profile.
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <AppLayout />
}
