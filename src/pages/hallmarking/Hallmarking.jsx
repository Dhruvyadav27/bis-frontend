import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, MapPin, UserPlus, Info, MessageSquareWarning, Loader2,
  CheckCircle2, Gem, ArrowRight, LocateFixed, Navigation, AlertTriangle, Send, MessageCircleQuestion,
} from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import ReferenceBadge from '../../components/common/ReferenceBadge'
import Disclaimer from '../../components/common/Disclaimer'
import {
  verifyHuid, findNearestCentres, getJewellerRegistrationInfo, getPurityInfo, getComplaintGuidance, askHallmarking,
} from '../../api/hallmarkingApi'

const SAMPLE_RESULT = {
  verified: true,
  purity: '18K750',
  ahcCentre: 'Sagar Assaying & Hallmarking Centre, Bhopal',
  hallmarkedOn: '2026-03-12',
}

function AskHallmarkingPanel() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const { mutate, isPending } = useMutation({
    mutationFn: (q) => askHallmarking(q, {}),
    onSuccess: (res, q) => setHistory((h) => [...h, { query: q, answer: res.answer }]),
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    mutate(query)
    setQuery('')
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
        <MessageCircleQuestion size={16} className="text-primary-700" />
        <p className="text-base font-bold text-slate-900 font-poppins">Ask About Hallmarking</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Any question about hallmarking rules, HUID, purity, or the assaying process.
      </p>

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
          placeholder="e.g. What does the HUID code actually mean?"
          className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        />
        <Button type="submit" disabled={isPending || !query.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </form>
    </Card>
  )
}

const MENU = [
  { id: 'verify', labelKey: 'hallmarking.verifyHuid', icon: ShieldCheck },
  { id: 'centre', labelKey: 'hallmarking.findCentre', icon: MapPin },
  { id: 'jeweller', labelKey: 'hallmarking.jewellerRegistration', icon: UserPlus },
  { id: 'purity', labelKey: 'hallmarking.purityStandards', icon: Info },
  { id: 'complaint', labelKey: 'hallmarking.fileComplaint', icon: MessageSquareWarning },
  { id: 'ask', labelKey: 'consumerAffairs.askQuestion', icon: MessageCircleQuestion },
]

function VerifyHuidPanel() {
  const [huid, setHuid] = useState('')
  const [data, setData] = useState(SAMPLE_RESULT)
  const [isSample, setIsSample] = useState(true)

  const { mutate, isPending } = useMutation({
    mutationFn: verifyHuid,
    onSuccess: (res) => {
      setData(res)
      setIsSample(false)
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!huid.trim()) return
    mutate({ huid })
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <p className="text-base font-bold text-slate-900 font-poppins">Verify Hallmark Unique ID (HUID)</p>
        <p className="text-xs text-slate-500 mt-0.5">Every hallmarked gold artifact carries an alphanumeric 6-character laser-etched HUID code.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="6-Character HUID Code"
            placeholder="e.g. AZ4E7B"
            value={huid}
            onChange={(e) => setHuid(e.target.value.toUpperCase())}
          />
        </div>
        <Button type="submit" disabled={isPending || !huid.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          Verify Authenticity
        </Button>
      </form>

      {data.verified === false && !isSample ? (
        <div className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50/70 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-red-900 font-poppins">
            <AlertTriangle size={18} className="text-red-700" />
            <span>No Record Found for This HUID</span>
          </div>
          <p className="mt-2 text-xs text-red-800">
            This HUID could not be verified against the BIS hallmarking database. This does not automatically
            mean the item is fake — double-check the code, or contact BIS to confirm.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/70 to-amber-100/40 p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-3 mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 font-poppins">
              <CheckCircle2 size={18} className="text-amber-700" />
              <span>{data.verified ? 'Statutory Hallmark Verified' : 'Authentication Unsuccessful'}</span>
            </div>
            {isSample && <Badge tone="warning">Pre-search Sample View</Badge>}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs py-1">
            <div className="rounded-xl bg-white/80 p-3 border border-amber-200/50">
              <dt className="text-slate-500 font-medium">Certified Fineness / Purity</dt>
              <dd className="mt-1 text-sm font-bold text-slate-900 font-poppins">{data.purity || '—'}</dd>
            </div>
            <div className="rounded-xl bg-white/80 p-3 border border-amber-200/50">
              <dt className="text-slate-500 font-medium">Assaying &amp; Hallmarking Centre</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2">{data.ahcCentre || '—'}</dd>
            </div>
            <div className="rounded-xl bg-white/80 p-3 border border-amber-200/50">
              <dt className="text-slate-500 font-medium">Hallmarking Timestamp</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">{data.hallmarkedOn || '—'}</dd>
            </div>
          </dl>

          <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-end">
            <span className="text-[11px] text-amber-900 font-medium">BIS Central Hallmarking Database Record</span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Disclaimer />
      </div>
    </Card>
  )
}

function FindCentrePanel() {
  const [coords, setCoords] = useState(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [centres, setCentres] = useState(null)

  const { mutate, isPending } = useMutation({
    mutationFn: findNearestCentres,
    onSuccess: (res) => setCentres(res.centres || []),
    onError: () => setError('Could not fetch nearby centres. Please try again.'),
  })

  function useMyLocation() {
    setError('')
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(c)
        setLocating(false)
        mutate(c)
      },
      () => {
        setLocating(false)
        setError('Location permission denied. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <div className="border-b border-slate-100 pb-3 mb-4">
        <p className="text-base font-bold text-slate-900 font-poppins">Find an Assaying &amp; Hallmarking Centre (AHC)</p>
        <p className="text-xs text-slate-500 mt-0.5">Locate the 3 nearest BIS-recognised gold and silver assaying centres.</p>
      </div>

      <Button type="button" onClick={useMyLocation} disabled={locating || isPending}>
        {locating || isPending ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
        {coords ? 'Refresh Nearby Centres' : 'Use My Location'}
      </Button>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {centres && (
        <div className="mt-5 space-y-3">
          {centres.length === 0 && <p className="text-xs text-slate-500">No centres found.</p>}
          {centres.map((c) => (
            <div key={c.name} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{[c.city, c.state].filter(Boolean).join(', ')}</p>
                {c.address && <p className="text-[11px] text-slate-400 mt-0.5">{c.address}</p>}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800 border border-primary-100 shrink-0">
                <Navigation size={11} /> {c.distanceKm} km
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function JewellerRegistrationPanel() {
  const [data, setData] = useState(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsPending(true)
    getJewellerRegistrationInfo()
      .then((res) => { if (!cancelled) setData(res) })
      .finally(() => { if (!cancelled) setIsPending(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <p className="text-base font-bold text-slate-900 font-poppins">Jeweller Portal &amp; Registration</p>
      {isPending && <Loader2 size={18} className="animate-spin mt-3 text-primary" />}
      {data && (
        <ol className="mt-4 space-y-2">
          {(data.steps || []).map((s, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 border border-slate-100 text-sm text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-800">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link to="/certification-guide" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors">
          <span>Explore certification procedures</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </Card>
  )
}

function PurityStandardsPanel() {
  const [code, setCode] = useState('18K750')
  const { mutate, data, isPending } = useMutation({ mutationFn: getPurityInfo })

  function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    mutate(code)
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <p className="text-base font-bold text-slate-900 font-poppins">Official Purity Standards for Gold &amp; Silver</p>
      <p className="mt-1 text-xs text-slate-500">Look up a fineness code (e.g. 24K999, 22K916, 18K750, 14K585) to see its karat and purity percentage.</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input label="Fineness / Purity Code" placeholder="e.g. 18K750" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </div>
        <Button type="submit" disabled={isPending || !code.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Info size={16} />}
          Look Up
        </Button>
      </form>

      {data && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <dt className="text-slate-500 font-medium">Karat</dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 font-poppins">{data.karat}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium">Purity</dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 font-poppins">{data.purityPercent}%</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-500 font-medium">Description</dt>
            <dd className="mt-1 text-sm text-slate-700">{data.description}</dd>
          </div>
        </div>
      )}
    </Card>
  )
}

function ComplaintPanel() {
  const [query, setQuery] = useState('')
  const { mutate, data, isPending } = useMutation({ mutationFn: getComplaintGuidance })

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    mutate(query)
  }

  return (
    <Card className="border-slate-200/90 shadow-sm">
      <p className="text-base font-bold text-slate-900 font-poppins">Report Non-Hallmarked or Substandard Jewelry</p>
      <p className="mt-1 text-xs text-slate-500">Describe the issue — e.g. lower purity than declared, missing hallmark, refusal to sell hallmarked items.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          placeholder="e.g. My gold turned out to be lower purity than what was declared on the invoice"
          className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50/30 focus:bg-white"
        />
        <Button type="submit" disabled={isPending || !query.trim()}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Get Guidance
        </Button>
      </form>

      {data && (
        <div className="mt-5 rounded-xl bg-amber-50/60 p-4 border border-amber-200 space-y-2">
          <p className="text-sm text-slate-800">{data.answer}</p>
          {data.applicableDoc && data.applicableClause && (
            <ReferenceBadge doc={data.applicableDoc} clause={data.applicableClause} />
          )}
          {data.compensationInfo && (
            <p className="text-xs text-slate-600 pt-1 border-t border-amber-200/60 mt-2">
              <strong>Compensation:</strong> {data.compensationInfo}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link to="/consumer-affairs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors">
          <span>Open consumer complaint portal</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </Card>
  )
}

export default function Hallmarking() {
  const { t } = useTranslation()
  const [active, setActive] = useState('verify')

  return (
    <div className="mx-auto max-w-5xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800 border border-amber-200">
          <Gem size={12} /> Precious Metals &amp; Jewelry Assaying
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('hallmarking.title')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('hallmarking.subtitle')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {MENU.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-150 ${
                active === id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={16} /> {t(labelKey)}
            </button>
          ))}
        </nav>

        <div>
          {active === 'verify' && <VerifyHuidPanel />}
          {active === 'centre' && <FindCentrePanel />}
          {active === 'jeweller' && <JewellerRegistrationPanel />}
          {active === 'purity' && <PurityStandardsPanel />}
          {active === 'complaint' && <ComplaintPanel />}
          {active === 'ask' && <AskHallmarkingPanel />}
        </div>
      </div>
    </div>
  )
}
