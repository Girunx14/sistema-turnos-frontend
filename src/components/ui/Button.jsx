export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button' }) {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 relative overflow-hidden group'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/40 border border-blue-500/20',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-lg shadow-black/20',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 border border-emerald-500/20',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 shadow-inner',
    ghost: 'hover:bg-white/10 text-slate-300 hover:text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      {variant === 'primary' || variant === 'success' ? (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
      ) : null}
    </button>
  )
}