import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Save, Loader2, Layers, HelpCircle, CheckCircle2, ArrowRight, Shield, LocateFixed, AlertTriangle } from 'lucide-react'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import StepperTimeline from '../../components/journey/StepperTimeline'
import StepCard from '../../components/journey/StepCard'
import { useJourneyStore } from '../../store/journeyStore'
import { getCurrentJourney, advanceJourney, startJourney } from '../../api/processGuideApi'
import { askAssistant } from '../../api/aiAssistantApi'

export default function ProcessGuide() {
  const { t } = useTranslation()
  const { journeyId, currentStep, stages, setJourney, advanceStep } = useJourneyStore()
  const [advancing, setAdvancing] = useState(false)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [checkingExisting, setCheckingExisting] = useState(true)
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState('')
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [startForm, setStartForm] = useState({
    productTitle: '',
    productDescription: '',
    state: '',
    district: '',
    manufacturerType: '',
  })

  // Reverse-geocodes GPS coordinates to a state/district via OpenStreetMap Nominatim
  // (same free service the backend uses for lab geocoding) — no backend change needed,
  // the journey/start API still just receives state+district text as before.
  function useMyLocationForJourney() {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          )
          const data = await res.json()
          const addr = data.address || {}
          setStartForm((f) => ({
            ...f,
            state: addr.state || f.state,
            district: addr.state_district || addr.county || addr.city_district || addr.city || f.district,
          }))
        } catch {
          setLocationError('Could not determine your state/district from location. Please enter manually.')
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        setLocationError('Location permission denied. Please enter your state/district manually.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    if (!journeyId) {
      getCurrentJourney()
        .then((data) => {
          if (data) setJourney(data)
        })
        .finally(() => setCheckingExisting(false))
    } else {
      setCheckingExisting(false)
    }
  }, [journeyId, setJourney])

  async function handleStartJourney(e) {
    e.preventDefault()
    if (!startForm.productTitle.trim() || !startForm.productDescription.trim() || !startForm.state.trim() || !startForm.district.trim()) {
      return
    }
    setStarting(true)
    setStartError('')
    try {
      const res = await startJourney(startForm)
      if (!res || !res.stages || !res.stages.length) {
        setStartError('The server did not return a valid journey. Please check the backend logs and try again.')
        return
      }
      setJourney(res)
    } catch (err) {
      setStartError(
        err?.response?.data?.message ||
        err?.message ||
        'Could not start the journey. Please check your connection and try again.'
      )
    } finally {
      setStarting(false)
    }
  }

  async function handleMarkDone(extra = {}) {
    setAdvancing(true)
    try {
      const res = await advanceJourney({ journeyId, step: currentStep, action: 'mark_done', ...extra })
      advanceStep(res.currentStep, res.message, res.stages)
    } finally {
      setAdvancing(false)
    }
  }

  function handleMarkDoneWithLocation() {
    if (!navigator.geolocation) {
      handleMarkDone()
      return
    }
    setAdvancing(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => handleMarkDone({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => handleMarkDone(), // permission denied — advance without GPS, backend holds the Find Lab stage until retried with coordinates
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleAsk(e) {
    e.preventDefault()
    if (!question.trim()) return
    setAsking(true)
    setAnswer(null)
    try {
      const res = await askAssistant({
        query: question,
        context: { currentAgent: 'process-guide-agent', currentStep },
      })
      setAnswer(res.answer)
      setQuestion('')
    } finally {
      setAsking(false)
    }
  }

  if (checkingExisting) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-slate-500 font-medium">Synchronizing application journey from BIS registry…</p>
      </div>
    )
  }

  if (!stages.length) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="border-b border-slate-200/80 pb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 border border-teal-200">
            <Layers size={12} /> Statutory Compliance Lifecycle
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
            {t('processGuide.startTitle')}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            {t('processGuide.startSubtitle')}
          </p>
        </div>

        <Card className="mt-6 border-slate-200/90 shadow-sm">
          <form onSubmit={handleStartJourney} className="space-y-4">
            <Input
              label={t('processGuide.productTitle')}
              placeholder="e.g. Stainless Steel Pressure Cooker"
              value={startForm.productTitle}
              onChange={(e) => setStartForm({ ...startForm, productTitle: e.target.value })}
            />
            <Input
              label={t('processGuide.productDescription')}
              placeholder="Briefly describe the product and its materials/use"
              value={startForm.productDescription}
              onChange={(e) => setStartForm({ ...startForm, productDescription: e.target.value })}
            />
            <div>
              <Button type="button" variant="secondary" onClick={useMyLocationForJourney} disabled={locating}>
                {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                {t('processGuide.useLocationBtn')}
              </Button>
              {locationError && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-red-50 p-2.5 border border-red-200 text-xs text-red-600 font-medium">
                  <AlertTriangle size={13} /> {locationError}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('processGuide.state')}
                placeholder="e.g. Madhya Pradesh"
                value={startForm.state}
                onChange={(e) => setStartForm({ ...startForm, state: e.target.value })}
              />
              <Input
                label={t('processGuide.district')}
                placeholder="e.g. Bhopal"
                value={startForm.district}
                onChange={(e) => setStartForm({ ...startForm, district: e.target.value })}
              />
            </div>
            <Input
              label={t('processGuide.manufacturerTypeOptional')}
              placeholder="e.g. MSME, Large Enterprise"
              value={startForm.manufacturerType}
              onChange={(e) => setStartForm({ ...startForm, manufacturerType: e.target.value })}
            />
            <Button type="submit" disabled={starting} className="w-full">
              {starting ? <Loader2 size={16} className="animate-spin" /> : t('processGuide.startCta')}
            </Button>
            {startError && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
                <AlertTriangle size={14} className="shrink-0" /> {startError}
              </div>
            )}
          </form>
        </Card>
      </div>
    )
  }

  const completedCount = stages.filter((s) => s.status === 'done').length
  const progressPercent = Math.round((completedCount / stages.length) * 100)

  return (
    <div className="mx-auto max-w-3xl py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 border border-teal-200">
          <Layers size={12} /> Statutory Compliance Lifecycle
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 font-poppins md:text-3xl">
          {t('processGuide.trackerTitle')}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          {t('processGuide.trackerSubtitle')}
        </p>
      </div>

      {/* Progress Metric Bar */}
      <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800">{t('processGuide.progress')}: </span>
            <span className="text-slate-500 font-medium">{completedCount} {t('common.of', { defaultValue: 'of' })} {stages.length} {t('processGuide.milestonesComplete')}</span>
          </div>
          <span className="font-bold text-primary font-poppins">{progressPercent}%</span>
        </div>
        <div className="mt-2.5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Cards List */}
      <div className="mt-6 space-y-3.5">
        {stages.map((stage) => (
          <StepCard
            key={stage.step}
            stage={stage}
            isCurrent={stage.step === currentStep}
            // Step 3 (Find Lab) needs GPS coordinates for the backend's nearest-lab
            // search — route it through the location-aware handler.
            onMarkDone={stage.step === 3 ? handleMarkDoneWithLocation : handleMarkDone}
            loading={advancing && stage.step === currentStep}
          />
        ))}
      </div>

      {/* Vertical Timeline Dropdown */}
      <details className="mt-6 group">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary-800 transition-colors flex items-center gap-1.5 list-none">
          <span className="rounded-md bg-primary-50 px-2.5 py-1 border border-primary-100">
            Toggle Full Vertical Timeline Overview
          </span>
        </summary>
        <Card className="mt-3 border-slate-200/90 shadow-sm">
          <StepperTimeline steps={stages} orientation="vertical" />
        </Card>
      </details>

      {/* Step Assistant Box */}
      <Card className="mt-6 border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
          <HelpCircle size={16} className="text-primary-700" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Consult AI on Current Step ({stages.find((s) => s.step === currentStep)?.title || 'Active Stage'})
          </p>
        </div>

        <form onSubmit={handleAsk} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="e.g. What specific documents are needed for factory inspection?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={asking || !question.trim()}>
              {asking ? <Loader2 size={16} className="animate-spin" /> : 'Ask AI'}
            </Button>
          </div>
        </form>

        {answer && (
          <div className="mt-3.5 rounded-xl border border-primary-100 bg-primary-50/70 p-3.5 text-xs leading-relaxed text-slate-800 shadow-2xs">
            <p className="font-semibold text-primary-900 mb-1">Regulatory Intelligence Advisory:</p>
            <p>{answer}</p>
          </div>
        )}

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Save size={12} /> Progress auto-synchronizes with BIS audit records in real time.
        </p>
      </Card>
    </div>
  )
}

