const TONES = {
  primary: 'bg-blue-50 text-primary-800 border-blue-200/80',
  accent: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
  danger: 'bg-rose-50 text-rose-800 border-rose-200/80',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {children}
    </span>
  )
}

