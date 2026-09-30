import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { ShieldAlert, Loader2, CheckCircle2, Shield, AlertTriangle, FileText, ArrowRight, HelpCircle, Send } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import ReferenceBadge from '../../components/common/ReferenceBadge'
import Disclaimer from '../../components/common/Disclaimer'
import { fileComplaint, askConsumerQuestion } from '../../api/consumerAffairsApi'

function AskQuestionPanel() {
  const [query, setQuery] = useState('')
  const { mutate, data, isPending } = useMutation({ mutationFn: askConsumerQuestion })

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    mutate(query)
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
        <HelpCircle size={16} className="text-primary-700" />
        <p className="text-base font-bold text-slate-900 font-poppins">Ask a Consumer Rights Question</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Not filing a complaint? Ask anything about verifying ISI/hallmark authenticity, mandatory certification, or spotting counterfeits.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          placeholder="e.g. How do I check if an ISI mark on a product is genuine?"
          className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/30 focus:bg-white"
        />
        <Button type="submit" disabled={isPending || !query.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Ask
        </Button>
      </form>

      {data && (
        data.insufficientEvidence ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
            <AlertTriangle size={14} /> Not enough verified information to answer this confidently.
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-primary-50/40 p-4 border border-primary-100 space-y-2">
            <p className="text-sm text-slate-800">{data.answer}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(data.references || []).map((r, i) => (
                <ReferenceBadge key={`${r.doc}-${i}`} doc={r.actName || r.doc} clause={r.clauseRef || r.clause} />
              ))}
            </div>
          </div>
        )
      )}
    </Card>
  )
}

// Sample output shown by default so the response structure is visible
// before the person files a real complaint.
const SAMPLE_RESULT = {
  complaintId: 'CMP-2026-0912',
  steps: ['File on Central CCPA / BIS Grievance Portal', 'Attach photographic / invoice evidence', 'Track adjudication status via Docket ID'],
  applicableClause: 'Consumer Protection Act, 2019 & BIS Act, 2016',
}

const COMPLAINT_TYPES = [
  { value: 'fake_isi_mark', label: 'Counterfeit / Fake ISI Mark' },
  { value: 'defective_certified_product', label: 'Substandard Certified Product' },
  { value: 'hallmarking_discrepancy', label: 'Hallmark Under-caratage / Fake HUID' },
  { value: 'other', label: 'Other Quality Violation' },
]

export default function ConsumerAffairs() {
  const { t } = useTranslation()
  const [mode, setMode] = useState('complaint') // 'complaint' | 'ask'
  const [complaintType, setComplaintType] = useState('fake_isi_mark')
  const [productDetails, setProductDetails] = useState('')
  const [data, setData] = useState(SAMPLE_RESULT)
  const [isSample, setIsSample] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: fileComplaint,
    onSuccess: (res) => {
      setData(res)
      setIsSample(false)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!productDetails.trim()) return
    mutate({ complaintType, productDetails })
  }

  return (
    <div className="mx-auto max-w-4xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-800 border border-rose-200">
          <ShieldAlert size={12} /> National Consumer Protection Cell
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('consumerAffairs.pageTitle')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('consumerAffairs.pageSubtitle')}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setMode('complaint')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150 ${
            mode === 'complaint' ? 'bg-white text-primary-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('consumerAffairs.fileComplaint')}
        </button>
        <button
          type="button"
          onClick={() => setMode('ask')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150 ${
            mode === 'ask' ? 'bg-white text-primary-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('consumerAffairs.askQuestion')}
        </button>
      </div>

      {mode === 'ask' ? (
        <div className="mt-6">
          <AskQuestionPanel />
        </div>
      ) : (
      <>
      {/* Form Card */}
      <Card className="mt-6 border-slate-200/90 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Violation Category
            </span>
            <div className="flex flex-wrap gap-2">
              {COMPLAINT_TYPES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setComplaintType(c.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    complaintType === c.value
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Product &amp; Retailer Specifics
            </label>
            <textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              rows={4}
              placeholder="Describe the product name, brand, retailer name, shop address / e-commerce URL, invoice number, and nature of defect..."
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/30 focus:bg-white"
            />
          </div>

          <div className="pt-1">
            <Button type="submit" disabled={isPending || !productDetails.trim()}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
              Generate Official Grievance Docket
            </Button>
          </div>
        </form>
      </Card>

      {/* Generated Grievance Receipt */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText size={16} className="text-primary-700" />
            Statutory Grievance Protocol
          </p>
          {isSample && <Badge tone="warning">Pre-submission Sample View</Badge>}
        </div>

        <div className="rounded-2xl border-2 border-primary-200/90 bg-gradient-to-br from-primary-50/60 via-white to-primary-50/30 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary-100 pb-3 mb-4">
            <div className="flex items-center gap-2 text-primary-800">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-poppins text-base font-bold">Official Docket Generated</p>
                <p className="text-xs text-primary-900 font-mono font-bold tracking-wider">Docket Reference: {data.complaintId}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200 self-start sm:self-auto">
              Ready for CCPA Submission
            </span>
          </div>

          <div className="my-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Redressal Sequence:</p>
            <ol className="space-y-2 text-xs text-slate-700">
              {data.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-2xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-primary-100 flex flex-wrap items-center justify-between gap-2">
            <ReferenceBadge doc={data.applicableClause} />
            <span className="text-[11px] text-slate-500">BIS Vigilance Department Protocol</span>
          </div>
        </div>

        <Disclaimer />
      </div>
      </>
      )}
    </div>
  )
}

