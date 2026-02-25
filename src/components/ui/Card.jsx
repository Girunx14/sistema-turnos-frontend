export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}