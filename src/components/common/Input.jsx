import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, className = '', as = 'input', ...rest }, ref) {
  const Tag = as
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</span>}
      <Tag
        ref={ref}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-white hover:border-slate-300'
        } ${className}`}
        {...rest}
      />
      {error && <span className="mt-1.5 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  )
})

export default Input

