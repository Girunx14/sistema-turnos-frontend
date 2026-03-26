export default function StatCard({ label, value, color = 'text-white', icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl group hover:bg-white/[0.05] transition-colors duration-300">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
      <div className="flex items-center gap-4 relative z-10">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-inner">
            {icon}
          </div>
        )}
        <div>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{label}</p>
          <p className={`text-4xl font-black tabular-nums tracking-tight ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}