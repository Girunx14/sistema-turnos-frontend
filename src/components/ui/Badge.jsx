export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white/10 text-slate-200 border border-white/10 shadow-inner',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold backdrop-blur-md ${variants[variant]}`}>
      {children}
    </span>
  )
}