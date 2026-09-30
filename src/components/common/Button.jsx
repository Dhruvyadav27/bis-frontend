const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow active:scale-[0.98]',
  secondary: 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]',
  accent: 'bg-accent text-white hover:bg-accent-700 shadow-sm hover:shadow active:scale-[0.98]',
  outline: 'border border-primary-200 text-primary-700 bg-white hover:bg-primary-50 active:scale-[0.98]',
  ghost: 'text-primary-700 hover:bg-primary-50 active:scale-[0.98]',
}

const SIZES = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) {
  const sizeClass = SIZES[size] || SIZES.md
  const variantClass = VARIANTS[variant] || VARIANTS.primary

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-primary/20 ${sizeClass} ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
