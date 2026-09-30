import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { ClipboardCheck, Loader2, FileText, Clock, Award, CheckCircle2, Shield, AlertTriangle, Sparkles, MessageCircleQuestion, Send } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import ReferenceBadge from '../../components/common/ReferenceBadge'
import Disclaimer from '../../components/common/Disclaimer'
import StepperTimeline from '../../components/journey/StepperTimeline'
import { recommendScheme, askFollowUp } from '../../api/certificationApi'

const SAMPLE_RESULT = {
  recommendedScheme: 'Simplified Procedure (Scheme-I)',
  reason:
    'MSME manufacturers with an active Udyam registration qualify for the simplified procedure, which reduces the documentation and inspection steps compared to the normal scheme.',
  processSteps: [
    { step: 1, title: 'Apply on Manak Online' },
    { step: 2, title: 'Submit test report from a BIS-recognised lab' },
    { step: 3, title: 'Factory inspection by BIS officer' },
    { step: 4, title: 'Grant of licence' },
  ],
  documentsRequired: ['Udyam registration', 'Test report', 'Factory layout plan', 'Identity proof'],
  estimatedTimeline: '45-60 days',
  references: [{ doc: 'Scheme of Testing and Inspection', clause: '4.1' }],
  friendlyExplanation: '',
  insufficientEvidence: false,
}

export default function CertificationGuide() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    productType: '',
    productCategory: '',
    manufacturerType: 'MSME',
    udyamRegistered: true,
    managementSystemCertificationRequested: false,
  })
  const [data, setData] = useState(SAMPLE_RESULT)
  const [isSample, setIsSample] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: recommendScheme,
    onSuccess: (res) => {
      setData(res)
      setIsSample(false)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.productType.trim()) return
    mutate(form)
  }

  return (
    <div className="mx-auto max-w-4xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-100">
          <Award size={12} /> Conformity Assessment Schemes
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('certificationGuide.title')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('certificationGuide.subtitle')}
        </p>
      </div>

      {/* Form Card */}
      <Card className="mt-6 border-slate-200/90 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('certificationGuide.productType')}
            placeholder={t('certificationGuide.productTypePlaceholder')}
            value={form.productType}
            onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value }))}
          />

          <Input
            label={t('certificationGuide.productCategory')}
            placeholder={t('certificationGuide.productCategoryPlaceholder')}
            value={form.productCategory}
            onChange={(e) => setForm((f) => ({ ...f, productCategory: e.target.value }))}
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('certificationGuide.manufacturerType')}
            </span>
            <select
              value={form.manufacturerType}
              onChange={(e) => setForm((f) => ({ ...f, manufacturerType: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
            >
              <option value="MSME">{t('certificationGuide.msme')}</option>
              <option value="LARGE">{t('certificationGuide.large')}</option>
              <option value="FOREIGN">{t('certificationGuide.foreign')}</option>
            </select>
          </label>

          {form.manufacturerType === 'MSME' && (
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.udyamRegistered}
                onChange={(e) => setForm((f) => ({ ...f, udyamRegistered: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="font-medium">{t('certificationGuide.udyam')}</span>
            </label>
          )}

          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.managementSystemCertificationRequested}
              onChange={(e) =>
                setForm((f) => ({ ...f, managementSystemCertificationRequested: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="font-medium">
              {t('certificationGuide.managementSystem')}
            </span>
          </label>

          <div className="pt-2">
            <Button type="submit" disabled={isPending || !form.productType.trim()}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
              {t('certificationGuide.cta')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Recommendation Results */}
      <div className="mt-8 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Shield size={16} className="text-emerald-600" />
            Conformity Assessment Recommendation
          </p>
          {isSample && <Badge tone="warning">Pre-search Sample View</Badge>}
        </div>

        {data.insufficientEvidence ? (
          /* Backend matched a scheme by rule, but has no PUBLISHED data for it yet
             (a real data gap, not a query problem) — show that honestly instead
             of a broken-looking empty results page. */
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Verified Data Not Yet Available</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-amber-950 font-poppins">
              {data.recommendedScheme}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              This looks like the right certification route, but our admin team hasn't published verified
              details for this scheme yet. {data.reason}
            </p>
          </div>
        ) : (
          <>
            {/* Highlight Card */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Optimal Licensing Pathway
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-emerald-950 font-poppins">
                {data.recommendedScheme}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-900">
                {data.reason}
              </p>
            </div>

            {/* Gemini's plain-language explanation */}
            {data.friendlyExplanation && (
              <Card className="border-primary-100 bg-primary-50/40">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles size={14} />
                  <span>In Simple Terms</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{data.friendlyExplanation}</p>
              </Card>
            )}

            {/* Process Steps */}
            {data.processSteps.length > 0 && (
              <Card>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sequential Compliance Roadmap
                </p>
                <StepperTimeline
                  steps={data.processSteps.map((s, i) => ({ ...s, status: i === 0 ? 'in_progress' : 'pending' }))}
                  orientation="horizontal"
                />
              </Card>
            )}

            {/* Supporting Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <FileText size={15} className="text-primary-700" />
                  <span>Mandatory Documentation Checklist</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {data.documentsRequired.map((d) => (
                    <li key={d} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span className="font-medium">{d}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <Clock size={15} className="text-accent" />
                    <span>Estimated Statutory Turnaround</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
                    <p className="font-poppins text-2xl font-bold text-slate-900">{data.estimatedTimeline}</p>
                    <p className="mt-1 text-[11px] text-slate-500">From application lodgement to grant of licence</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {data.references.map((r, i) => (
                    <ReferenceBadge key={`${r.doc}-${i}`} doc={r.doc} clause={r.clause} />
                  ))}
                </div>
              </Card>
            </div>

            <AskAboutSchemeBox schemeName={data.recommendedScheme} />
          </>
        )}

        <Disclaimer />
      </div>
    </div>
  )
}

// Follow-up Q&A on the matched scheme (Agent 2's /ask endpoint). Stays grounded
// in this scheme's own verified data — out-of-scope questions get told so.
function AskAboutSchemeBox({ schemeName }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([]) // [{ query, answer }]
  const { mutate, isPending } = useMutation({
    mutationFn: (q) => askFollowUp(schemeName, q),
    onSuccess: (res, q) => setHistory((h) => [...h, { query: q, answer: res.answer }]),
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    mutate(query)
    setQuery('')
  }

  return (
    <Card className="border-primary-100">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircleQuestion size={16} className="text-primary-700" />
        <p className="text-sm font-bold text-slate-900 font-poppins">
          Have a follow-up question about {schemeName}?
        </p>
      </div>

      {history.length > 0 && (
        <div className="mb-4 space-y-3">
          {history.map((h, i) => (
            <div key={i} className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500">Q: {h.query}</p>
              <p className="text-sm text-slate-800 bg-slate-50 rounded-lg p-3 border border-slate-100">{h.answer}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. How long does the factory inspection usually take?"
          className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        />
        <Button type="submit" disabled={isPending || !query.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </form>
    </Card>
  )
}
