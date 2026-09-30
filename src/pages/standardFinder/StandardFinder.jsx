import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Search, Loader2, Sparkles, BookOpen, Layers, AlertTriangle, ShieldCheck, ShieldOff } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import ReferenceBadge from '../../components/common/ReferenceBadge'
import Disclaimer from '../../components/common/Disclaimer'
import { searchStandards } from '../../api/standardFinderApi'

const CATEGORIES = ['Electricals', 'Food & packaging', 'Textiles', 'Construction', 'Toys', 'Chemicals']

// Sample output shown by default so the response structure is visible
// before the person runs a real search.
const SAMPLE_RESULT = {
  results: [
    { isNumber: 'IS 16102', title: 'LED luminaires for general lighting purposes', matchScore: 96, clause: '5.2', isCompulsory: true, regulatoryType: 'QCO' },
    { isNumber: 'IS 10322', title: 'Luminaires — general requirements and tests', matchScore: 84, clause: '7.1', isCompulsory: false, regulatoryType: 'VOLUNTARY' },
    { isNumber: 'IS 15885', title: 'Self-ballasted LED lamps for general lighting', matchScore: 71, clause: '4.3', isCompulsory: false, regulatoryType: 'VOLUNTARY' },
  ],
  insufficientEvidence: false,
  message: null,
  explanation: '',
}

export default function StandardFinder() {
  const { t } = useTranslation()
  const [description, setDescription] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [result, setResult] = useState(SAMPLE_RESULT)
  const [isSample, setIsSample] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: searchStandards,
    onSuccess: (res) => {
      setResult(res)
      setIsSample(false)
    },
  })

  function handleSearch(e) {
    e.preventDefault()
    if (!description.trim()) return
    mutate({ productDescription: description })
  }

  return (
    <div className="mx-auto max-w-4xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-blue-100">
          <BookOpen size={12} /> Indian Standards Catalog
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('standardFinder.title')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('standardFinder.subtitle')}
        </p>
      </div>

      {/* Query Card */}
      <Card className="mt-6 border-slate-200/90 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              {t('standardFinder.inputLabel')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="e.g. LED bulb for household lighting, 9 watt, screw fitting B22 cap with surge protection"
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/30 focus:bg-white"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-500 mb-2">Filter by sector:</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c === activeCategory ? null : c)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                    activeCategory === c
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending || !description.trim()}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {t('standardFinder.cta')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-primary-700" />
            <p className="text-sm font-bold text-slate-800">
              {result.results.length} Standards Identified
            </p>
          </div>
          {isSample && (
            <Badge tone="warning">Pre-search Sample View</Badge>
          )}
        </div>

        {result.insufficientEvidence ? (
          /* No retrieval cleared the confidence threshold — say so honestly
             instead of silently showing an empty list. */
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">No Confident Match Found</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              {result.message || 'No verified standard could be matched confidently for this description. Try a more specific product description.'}
            </p>
          </div>
        ) : (
          <>
            {result.explanation && (
              <Card className="border-primary-100 bg-primary-50/40">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles size={14} />
                  <span>In Simple Terms</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{result.explanation}</p>
              </Card>
            )}

            <div className="space-y-3">
              {result.results.map((r) => (
                <Card key={r.isNumber} className="hover:border-primary/40 transition-all duration-200 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-poppins text-base font-bold text-primary-800 tracking-tight">
                          {r.isNumber}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-medium text-slate-700">{r.title}</span>
                        {r.isCompulsory ? (
                          <Badge tone="danger">
                            <ShieldCheck size={11} className="mr-1 inline" /> Compulsory
                          </Badge>
                        ) : (
                          <Badge tone="neutral">
                            <ShieldOff size={11} className="mr-1 inline" /> Voluntary
                          </Badge>
                        )}
                        {r.regulatoryType && <Badge tone="neutral">{r.regulatoryType}</Badge>}
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <ReferenceBadge doc={r.isNumber} clause={r.clause} />
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      <Badge tone={r.matchScore >= 90 ? 'success' : r.matchScore >= 75 ? 'primary' : 'neutral'}>
                        {r.matchScore}% Match Score
                      </Badge>
                      {/* Visual Confidence Bar */}
                      <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${
                            r.matchScore >= 90 ? 'bg-emerald-500' : r.matchScore >= 75 ? 'bg-primary' : 'bg-slate-400'
                          }`}
                          style={{ width: `${r.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        <Disclaimer />
      </div>
    </div>
  )
}
