export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button' }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20',
    danger: 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 hover:border-red-500/40',
    ghost: 'hover:bg-slate-800 text-slate-400 hover:text-white',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    xl: 'px-8 py-5 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}