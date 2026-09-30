import { Check, Circle, Lock } from 'lucide-react'

const STATUS_STYLES = {
  done: {
    dot: 'bg-accent text-white',
    line: 'bg-accent',
    icon: Check,
  },
  in_progress: {
    dot: 'bg-primary text-white',
    line: 'bg-slate-200',
    icon: Circle,
  },
  pending: {
    dot: 'bg-slate-100 text-slate-400',
    line: 'bg-slate-200',
    icon: Lock,
  },
}

/**
 * Generic step timeline.
 * `orientation`: 'horizontal' (used by Certification Guide's process steps)
 *   or 'vertical' (used by the Process Guide Agent's full journey).
 * `steps`: [{ step, title, status?, result? }]
 */
export default function StepperTimeline({ steps, orientation = 'horizontal', renderExtra }) {
  if (orientation === 'horizontal') {
    return (
      <ol className="flex flex-wrap items-start gap-0">
        {steps.map((s, idx) => {
          const status = s.status || (idx === 0 ? 'in_progress' : 'pending')
          const style = STATUS_STYLES[status]
          const Icon = style.icon
          return (
            <li key={s.step} className="flex flex-1 min-w-[140px] items-center">
              <div className="flex flex-col items-center gap-2 px-2 text-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${style.dot}`}>
                  {status === 'pending' ? <Icon size={14} /> : s.step}
                </div>
                <p className="text-xs font-medium text-slate-600">{s.title}</p>
                {renderExtra?.(s)}
              </div>
              {idx < steps.length - 1 && <div className={`h-px flex-1 ${style.line}`} />}
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className="space-y-0">
      {steps.map((s, idx) => {
        const style = STATUS_STYLES[s.status] || STATUS_STYLES.pending
        const Icon = style.icon
        const isLast = idx === steps.length - 1
        return (
          <li key={s.step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${style.dot}`}>
                {s.status === 'done' ? <Icon size={15} /> : s.step}
              </div>
              {!isLast && <div className={`w-px flex-1 ${style.line}`} style={{ minHeight: 28 }} />}
            </div>
            <div className={`pb-6 ${s.status === 'pending' ? 'opacity-50' : ''}`}>
              {renderExtra ? renderExtra(s) : <p className="pt-1 text-sm font-medium text-slate-700">{s.title}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
