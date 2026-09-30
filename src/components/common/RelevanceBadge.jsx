import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

export default function RelevanceBadge({ level, score, className = '' }) {
  let computedLevel = level?.toLowerCase()

  if (typeof score === 'number') {
    if (score >= 90) computedLevel = 'high'
    else if (score >= 70) computedLevel = 'medium'
    else computedLevel = 'low'
  }

  if (!computedLevel) computedLevel = 'high'

  const configs = {
    high: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
      icon: CheckCircle,
      label: typeof score === 'number' ? `${score}% Match` : 'High Relevance',
      dot: 'bg-emerald-500',
    },
    medium: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/90',
      icon: AlertTriangle,
      label: typeof score === 'number' ? `${score}% Moderate` : 'Medium Relevance',
      dot: 'bg-amber-500',
    },
    low: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200/90',
      icon: AlertCircle,
      label: typeof score === 'number' ? `${score}% Low` : 'Low Relevance',
      dot: 'bg-rose-500',
    },
  }

  const current = configs[computedLevel] || configs.high
  const Icon = current.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${current.bg} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      <Icon size={12} className="shrink-0 opacity-80" />
      <span>{current.label}</span>
    </span>
  )
}
