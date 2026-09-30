import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Award,
  Server,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Plus,
} from 'lucide-react'
import { getOverview } from '../../api/adminApi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOverview().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const stats = [
    {
      title: 'Standards in Repository',
      value: data ? `${data.standardsCount}` : '—',
      subtitle: `${data?.publishedStandards || 0} published · ${data?.pendingStandards || 0} pending`,
      icon: BookOpen,
      to: '/admin/standards',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Certification Schemes',
      value: data ? `${data.schemesCount}` : '—',
      subtitle: 'ISI, CRS, FMCS, Management',
      icon: Award,
      to: '/admin/schemes',
      color: 'bg-emerald-500',
    },
    {
      title: 'Core Digital Services',
      value: data ? `${data.servicesCount}` : '—',
      subtitle: '100% operational uptime',
      icon: Server,
      to: '/admin/services',
      color: 'bg-indigo-500',
    },
    {
      title: 'Pending Review Queue',
      value: data ? `${data.pendingReviewsCount}` : '—',
      subtitle: 'Dual-approval required to publish',
      icon: Clock,
      to: '/admin/standards?tab=pending',
      color: 'bg-amber-500',
      urgent: true,
    },
    {
      title: 'Flagged AI Responses',
      value: data ? `${data.flaggedAnswersCount}` : '—',
      subtitle: 'Need technical verification',
      icon: AlertTriangle,
      to: '/admin/flagged-answers',
      color: 'bg-rose-500',
      urgent: true,
    },
    {
      title: 'Managed User Accounts',
      value: data ? `${data.totalUsersCount}` : '—',
      subtitle: 'MSMEs, Labs, Officers, Consumers',
      icon: Users,
      to: '/admin/users',
      color: 'bg-teal-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-slate-900 to-primary p-6 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            <h1 className="font-poppins text-xl font-bold tracking-tight">
              BIS Administration & Governance Portal
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
            Centralized management for Bureau of Indian Standards databases, certification scheme definitions,
            AI hallucination monitoring, and regulatory trend analytics under Problem Statement SIH 26107.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/admin/standards">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm">
              <Plus size={14} /> Add Standard Draft
            </Button>
          </Link>
          <Link to="/app/home">
            <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
              View Public App
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              to={item.to}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{item.title}</p>
                  <p className="mt-2 font-poppins text-2xl font-bold text-slate-900">
                    {loading ? '...' : item.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">{item.subtitle}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-white shadow-xs`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                <span>Access module</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Two-Column Working Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Workflow Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileCheck size={17} className="text-amber-500" />
              <h2 className="font-poppins text-sm font-bold text-slate-800">
                Pending Regulatory Approvals
              </h2>
            </div>
            <Link to="/admin/standards" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3.5 flex items-center justify-between">
              <div>
                <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                  Pending Second Admin Review
                </span>
                <p className="font-semibold text-xs text-slate-900 mt-1">
                  IS 16046 (Part 2):2018 Amendment 1
                </p>
                <p className="text-[11px] text-slate-600">
                  Lithium cell testing methodology revision submitted by Standards Directorate.
                </p>
              </div>
              <Link to="/admin/standards" className="shrink-0 ml-3">
                <Button size="xs" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Review
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-center justify-between">
              <div>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                  Draft In Progress
                </span>
                <p className="font-semibold text-xs text-slate-900 mt-1">
                  IS 9873 (Part 1):2019 QCO Draft
                </p>
                <p className="text-[11px] text-slate-600">
                  Safety of Toys: Mechanical specifications. Requires sectional committee notes.
                </p>
              </div>
              <Link to="/admin/standards" className="shrink-0 ml-3">
                <Button size="xs" variant="secondary">
                  Open Draft
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* AI Answer Quality Surveillance */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} className="text-rose-500" />
              <h2 className="font-poppins text-sm font-bold text-slate-800">
                Flagged AI Answer Audits
              </h2>
            </div>
            <Link to="/admin/flagged-answers" className="text-xs font-semibold text-primary hover:underline">
              Review Queue ({data?.flaggedAnswersCount || 0})
            </Link>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-700">Confidence: 68% (Low)</span>
                <span className="text-[10px] text-slate-400">FLG-101 · Today</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                "Is BIS certification mandatory for Bluetooth speakers under CRS?"
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                User report: Check whether wattage exemption clauses apply under IS 616.
              </p>
              <div className="mt-2.5 flex items-center justify-end gap-2">
                <Link to="/admin/flagged-answers">
                  <Button size="xs" className="bg-rose-600 hover:bg-rose-700 text-white">
                    Audit & Resolve
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Aggregated Query Trends Ready</p>
                <p className="text-[11px] text-slate-500">
                  24,890 citizen queries analyzed with complete privacy protection.
                </p>
              </div>
              <Link to="/admin/consumer-trends">
                <Button size="xs" variant="secondary">
                  View Trends
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
