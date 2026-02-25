export default function StatCard({ label, value, color = 'text-white', icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      {icon && (
        <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
      </div>
    </div>
  )
}