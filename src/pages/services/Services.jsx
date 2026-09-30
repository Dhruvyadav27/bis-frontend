import { Link } from 'react-router-dom'
import { Search, BadgeCheck, Gem, FlaskConical, ShieldAlert, ArrowRight, Layers } from 'lucide-react'
import Card from '../../components/common/Card'

const SERVICES = [
  {
    to: '/standard-finder',
    icon: Search,
    title: 'Standard Finder',
    tag: 'National Standards',
    description: 'Describe any product in plain words and identify the applicable Indian Standard (IS), mandatory clauses, and testing specifications.',
    color: 'bg-blue-50 text-primary-700 border-blue-100',
  },
  {
    to: '/certification-guide',
    icon: BadgeCheck,
    title: 'Certification Guide',
    tag: 'Conformity Schemes',
    description: 'Get an AI-recommended certification scheme with stage-by-stage documentation checklists, inspection details, and expected timelines.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    to: '/hallmarking',
    icon: Gem,
    title: 'Hallmarking & HUID',
    tag: 'Gold & Silver Assaying',
    description: 'Verify 6-digit Hallmark Unique Identification (HUID) numbers, find certified assaying centres, or check jeweller registration records.',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    to: '/find-lab',
    icon: FlaskConical,
    title: 'Find a Lab',
    tag: 'National Lab Directory',
    description: 'Search BIS-recognised state and private testing laboratories near you filtered by product type, testing parameter, or city.',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  },
  {
    to: '/consumer-affairs',
    icon: ShieldAlert,
    title: 'Consumer Affairs',
    tag: 'Grievance & Redressal',
    description: 'File an official grievance against counterfeit ISI marks, substandard certified goods, or fraudulent hallmarked jewelry.',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  {
    to: '/process-guide',
    icon: Layers,
    title: 'Application Journey Tracker',
    tag: 'Workflow Automation',
    description: 'Track your ongoing license and certification lifecycle through an interactive timeline with real-time AI regulatory assistance.',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
  },
]

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl py-6">
      <div className="border-b border-slate-200/80 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-primary-100">
          Central Services Directory
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 font-poppins">
          BIS Smart Assist Services
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Integrated regulatory intelligence platform engineered for manufacturers, MSMEs, jewelers, testing laboratories, and Indian consumers.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ to, icon: Icon, title, tag, description, color }) => (
          <Link key={to} to={to} className="group block h-full">
            <Card className="flex h-full flex-col justify-between transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:border-primary/30">
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${color} shadow-2xs transition-transform duration-200 group-hover:scale-110`}>
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    {tag}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900 font-poppins group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-semibold text-primary group-hover:text-primary-800 transition-colors">
                <span>Access service module</span>
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

