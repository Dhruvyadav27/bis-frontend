import { useState, useEffect } from 'react'
import { TrendingUp, ShieldCheck, BarChart2, Hash, Calendar, PieChart, Layers } from 'lucide-react'
import { getConsumerTrends } from '../../api/adminApi'
import Card from '../../components/common/Card'

export default function ConsumerQueryTrends() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConsumerTrends().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Title & Privacy Compliance Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-poppins text-xl font-bold text-slate-900">
            Consumer Query Trends &amp; Regulatory Demand
          </h1>
          <p className="text-xs text-slate-500">
            Macro-level anonymized citizen inquiry patterns to advise sectional standardization committees.
          </p>
        </div>

        {/* Strict Data Privacy Badge */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs self-start sm:self-auto">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Privacy Compliant • Zero PII Exposed</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Analyzed Inquiries</p>
          <p className="mt-2 font-poppins text-2xl font-bold text-slate-900">
            {loading ? '...' : (data?.totalQueriesTracked || 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">↑ +14.2% from prior month</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Dominant Sector</p>
          <p className="mt-2 font-poppins text-xl font-bold text-primary-700">
            Electronics &amp; IT (CRS)
          </p>
          <p className="mt-1 text-[11px] text-slate-500">34% of all public queries</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">HUID Hallmarking Checks</p>
          <p className="mt-2 font-poppins text-2xl font-bold text-emerald-700">
            {loading ? '...' : '6,220'}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Gold laser authenticity searches</p>
        </div>
      </div>

      {/* Aggregate Category Breakdown & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-primary" />
              <h2 className="font-poppins text-sm font-bold text-slate-800">
                Inquiry Distribution by Regulatory Sector
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-4">
            {data?.categoryBreakdown?.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-800">{cat.category}</span>
                  <span className="font-semibold text-slate-600">
                    {cat.queries.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Query Influx Trend (1 Col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-emerald-600" />
              <h2 className="font-poppins text-sm font-bold text-slate-800">
                Weekly Volume
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Q1 2026</span>
          </div>

          <div className="space-y-4 pt-2">
            {data?.weeklyTrend?.map((item) => (
              <div key={item.week} className="flex items-center gap-3 text-xs">
                <span className="w-16 text-slate-500 font-medium shrink-0">{item.week}</span>
                <div className="flex-1 bg-slate-100 h-6 rounded-lg overflow-hidden relative">
                  <div
                    className="bg-emerald-600 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(item.volume / 8000) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {item.volume.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Topics & Keywords */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Hash size={16} className="text-primary" />
          <h2 className="font-poppins text-sm font-bold text-slate-800">
            Most Frequent Regulatory Topics &amp; Clarification Requests
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {data?.topKeywords?.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200 transition-colors"
            >
              <span className="text-primary font-bold">#</span>
              <span>{kw}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
