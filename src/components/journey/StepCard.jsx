import Button from '../common/Button'
import { Check, Lock, Loader2, PlayCircle } from 'lucide-react'

// Each stage's `result` comes from a different backend agent, so it's a different
// shaped object per step — never a plain string. This turns it into one safe,
// readable line instead of ever handing a raw object to React as a child
// (which crashes with "Objects are not valid as a React child").
function summarizeStageResult(stage) {
  const result = stage.result
  if (result == null) return null
  if (typeof result === 'string') return result
  if (typeof result === 'number' || typeof result === 'boolean') return String(result)

  try {
    // Step 1 — Standard Finder shape: { results: [...], insufficientEvidence, message }
    if (Array.isArray(result.results)) {
      if (result.insufficientEvidence) return result.message || 'No confident standard match found.'
      const top = result.results[0]
      return top ? `Matched standard: ${top.isNumber} — ${top.title}` : 'No standards matched.'
    }

    // Step 2 / 4 — Certification Guide shape: { recommendedScheme, reason, ... }
    if (result.recommendedScheme) {
      return `Recommended scheme: ${result.recommendedScheme}`
    }

    // Step 3 — Find Lab shape: { labs: [...] }
    if (Array.isArray(result.labs)) {
      const top = result.labs[0]
      return top
        ? `Nearest lab: ${top.name} (${top.distanceKm} km)`
        : 'No nearby labs found yet — share your location to search.'
    }

    // Generic fallback: pull the first string-ish field so *something* readable shows,
    // rather than dumping raw JSON.
    const firstStringField = Object.values(result).find((v) => typeof v === 'string' && v.trim())
    if (firstStringField) return firstStringField

    return 'Step completed.'
  } catch {
    return 'Step completed.'
  }
}

export default function StepCard({ stage, isCurrent, onMarkDone, loading }) {
  if (stage.status === 'done') {
    const summary = summarizeStageResult(stage)
    return (
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-emerald-800">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
              ✓
            </span>
            <span>Step {stage.step}: {stage.title}</span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Completed
          </span>
        </div>
        {summary && (
          <div className="mt-2 rounded-lg bg-white/70 p-2.5 border border-emerald-100 text-xs text-slate-700">
            <strong className="text-emerald-950">Verified Outcome:</strong> {summary}
          </div>
        )}
      </div>
    )
  }

  if (stage.status === 'pending') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs font-semibold">
            {stage.step}
          </span>
          <span className="font-medium text-slate-500">{stage.title}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <Lock size={12} />
          <span>Locked</span>
        </div>
      </div>
    )
  }

  if (stage.status === 'skipped') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/40 px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs font-semibold">
            {stage.step}
          </span>
          <span className="font-medium text-slate-500 line-through">{stage.title}</span>
        </div>
        <span className="text-[11px] font-medium">Skipped</span>
      </div>
    )
  }

  // in_progress
  return (
    <div className="rounded-xl border-2 border-primary-300 bg-white p-4 shadow-sm ring-4 ring-primary-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm font-bold text-primary-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
            {stage.step}
          </span>
          <span>{stage.title}</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-800">
          <PlayCircle size={11} className="animate-pulse" /> Active Step
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        This stage is currently active in your statutory pathway. Confirm compliance to proceed to the next milestone.
      </p>
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <Button onClick={onMarkDone} disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          Mark Step Completed
        </Button>
      </div>
    </div>
  )
}
