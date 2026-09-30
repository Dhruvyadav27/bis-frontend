import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  BadgeCheck,
  Gem,
  FlaskConical,
  ShieldAlert,
  Route as RouteIcon,
  Bot,
} from 'lucide-react'
import HeroCarousel from '../../components/common/HeroCarousel'
import Reveal from '../../components/common/Reveal'
import aboutUsImage from '../../assets/about-us.png'

const ABOUT_TEXT =
  'This AI-Powered Intelligent Assistant is engineered specifically to address SIH 2026 Problem Statement SIH26107. Built on top of the comprehensive regulatory framework of the Bureau of Indian Standards (BIS), our goal is to bridge the gap between complex legal/technical standardization documentation and everyday users. By providing context-aware, source-backed natural language query processing, we enable Industries & Manufacturers to rapidly streamline their compliance pathways and empower Consumers to instantaneously verify the safety and authenticity of the goods they buy.'

// The 7 AI agents that make up the platform, shown as icon-driven agent
// cards (no photography) right after the hero carousel.
const AGENTS = [
  {
    to: '/standard-finder',
    icon: Search,
    title: 'Standard Finder',
    category: 'Standardization & Clauses',
    description: 'Describe a product in plain language and discover the exact matching Indian Standard (IS), mandatory clauses, and testing specifications.',
    iconBg: 'bg-blue-600',
    ring: 'group-hover:ring-blue-200',
    badgeBg: 'bg-blue-50 text-primary-700 border-blue-100',
  },
  {
    to: '/certification-guide',
    icon: BadgeCheck,
    title: 'Certification Guide',
    category: 'Conformity Assessment',
    description: 'Get an AI-recommended certification scheme (ISI, CRS, FMCS) with required documentation, inspection stages, and timelines.',
    iconBg: 'bg-emerald-600',
    ring: 'group-hover:ring-emerald-200',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    to: '/hallmarking',
    icon: Gem,
    title: 'Hallmarking',
    category: 'Precious Metals & HUID',
    description: 'Verify 6-digit Hallmark Unique Identification (HUID) numbers, locate BIS-recognized Assaying &amp; Hallmarking Centres, or check registered jewellers.',
    iconBg: 'bg-amber-600',
    ring: 'group-hover:ring-amber-200',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-100',
  },
  {
    to: '/find-lab',
    icon: FlaskConical,
    title: 'Find a Lab',
    category: 'Laboratory Network',
    description: 'Locate certified national testing laboratories and BIS-recognized third-party facilities nearest to you by product, test, or city.',
    iconBg: 'bg-indigo-600',
    ring: 'group-hover:ring-indigo-200',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  {
    to: '/consumer-affairs',
    icon: ShieldAlert,
    title: 'Consumer Affairs',
    category: 'Consumer Protection & Redressal',
    description: 'Ask consumer-rights questions, verify product authenticity, or report misuse of ISI marks and hallmarking discrepancies.',
    iconBg: 'bg-rose-600',
    ring: 'group-hover:ring-rose-200',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  {
    to: '/process-guide',
    icon: RouteIcon,
    title: 'Process Guide',
    category: 'Guided Application Journey',
    description: 'The flagship orchestrator — give it your product once and it proactively walks you through the entire certification journey, step by step.',
    iconBg: 'bg-violet-600',
    ring: 'group-hover:ring-violet-200',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  {
    to: '/ai-assistant',
    icon: Bot,
    title: 'AI Assistant',
    category: 'Context-Aware Q&A',
    description: 'Ask anything about BIS standards, certification, or services — grounded, source-cited answers, available on every screen.',
    iconBg: 'bg-teal-600',
    ring: 'group-hover:ring-teal-200',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-100',
  },
]

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: 'Headquarters Address',
    value: 'Bureau of Indian Standards, Manak Bhawan, 9 Bahadur Shah Zafar Marg, New Delhi 110002',
    href: 'https://maps.google.com/?q=Manak+Bhawan+New+Delhi',
    actionLabel: 'View on map',
  },
  {
    icon: Phone,
    label: 'National Toll-Free Helpline',
    value: '1800-11-3011 (Toll free)',
    subValue: 'Available Mon–Sat, 9:00 AM – 5:30 PM',
    href: 'tel:1800113011',
    actionLabel: 'Call helpline',
  },
  {
    icon: Mail,
    label: 'Official Grievance & Inquiries',
    value: 'info@bis.gov.in',
    subValue: 'Direct correspondence portal',
    href: 'mailto:info@bis.gov.in',
    actionLabel: 'Send email',
  },
]

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.querySelector(location.hash)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash])

  return (
    <div className="bg-white">
      {/* Hero Carousel — full viewport width */}
      <div className="relative left-1/2 -mt-4 w-screen -translate-x-1/2 md:-mt-8">
        <HeroCarousel />
      </div>

      {/* AI Agents — shown immediately after the carousel */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-24 py-16 px-4">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-100">
              7 Specialized AI Agents
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl font-poppins">
              BIS Smart Assist — Intelligent Regulatory Guidance
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
              Each agent handles one part of your BIS journey — from finding the right standard to guiding your entire certification process, step by step.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => (
            <Reveal key={agent.to} delay={i * 60}>
              <Link to={agent.to} className="group block h-full">
                <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-slate-300">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${agent.iconBg} text-white shadow-md ring-4 ring-transparent transition-all duration-300 ${agent.ring}`}
                  >
                    <agent.icon size={26} strokeWidth={2} />
                  </div>
                  <span className={`mt-4 inline-block w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${agent.badgeBg}`}>
                    {agent.category}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 font-poppins group-hover:text-primary transition-colors">
                    {agent.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {agent.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 group-hover:text-primary-800">
                    <span>Open agent</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 py-16 px-4">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-primary-100">
              National Standards Body of India
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl font-poppins">
              Empowering Quality, Safety &amp; Innovation
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
              Operating under the Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          {/* Main Story & Image Showcase with generous space between them */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Content Card */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-9 shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-primary-700 mb-2">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                    Statutory Framework
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-poppins">
                  SIH 2026 Intelligent Regulatory Architecture
                </h3>
                <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
                  {ABOUT_TEXT}
                </p>
              </div>
            </div>

            {/* Right: Dedicated Image Showcase Card with proper spacing */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
                <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                  <img
                    src={aboutUsImage}
                    alt="Bureau of Indian Standards Headquarters - Manak Bhawan"
                    className="w-full h-auto object-contain rounded-lg select-none"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between px-2 py-0.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin size={14} className="text-primary-700" />
                    <span>Manak Bhawan</span>
                  </div>
                  <span className="text-[11px] text-slate-500">New Delhi • BIS National HQ</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Institutional Pillars Cards with clean spacing */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary-700 border border-blue-100 mb-3">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900 font-poppins">Harmonious Standards</p>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Over 20,000+ Indian Standards codified across industries to guarantee safety and interoperability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900 font-poppins">Consumer Trust &amp; Assurance</p>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Instant HUID gold hallmarking validation and statutory protection against counterfeit ISI marks.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100 mb-3">
                <Sparkles size={20} />
              </div>
              <p className="text-sm font-bold text-slate-900 font-poppins">AI Regulatory Intelligence</p>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Context-aware guidance for manufacturers, MSMEs, and citizens navigating conformity pathways.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact Us */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 py-16 px-4">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700 border border-slate-200">
              National Helpdesk
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl font-poppins">Contact Us</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              Reach out to the Bureau of Indian Standards for regulatory assistance, licensing support, and grievance redressal.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value, subValue, href, actionLabel }) => (
              <div
                key={label}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 border border-primary-100 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800 leading-snug">{value}</p>
                  {subValue && <p className="mt-1 text-xs text-slate-500">{subValue}</p>}
                </div>
                {href && (
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-700 transition-colors"
                    >
                      <span>{actionLabel}</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}

