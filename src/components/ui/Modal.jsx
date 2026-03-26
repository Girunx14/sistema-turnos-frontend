import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-xl transition-opacity animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}