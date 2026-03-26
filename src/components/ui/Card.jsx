export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white/[0.02] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden ${padding ? 'p-6 lg:p-8' : ''} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}