export default function Card({ children, className = '', nested = false }) {
  return (
    <div
      className={`rounded-2xl ${
        nested ? 'bg-slate-50/80 border border-slate-200/80' : 'bg-white border border-slate-200/80 shadow-sm'
      } p-6 ${className}`}
    >
      {children}
    </div>
  )
}

