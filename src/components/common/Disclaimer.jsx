import { ShieldAlert, ExternalLink } from 'lucide-react'

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 text-xs text-amber-900 shadow-2xs">
      <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
      <div className="flex-1">
        <span className="font-semibold text-amber-950">Official Regulatory Notice: </span>
        <span className="text-amber-800">
          Standards data and procedures provided here are AI-synthesized reference guides. Always confirm final conformity criteria on the official{' '}
          <a
            href="https://www.manakonline.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-amber-950 inline-flex items-center gap-0.5"
          >
            Manak Online Portal <ExternalLink size={10} />
          </a>{' '}
          or BIS Care App prior to formal statutory submissions.
        </span>
      </div>
    </div>
  )
}

