import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

export default function Header({ title }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-20 bg-[#0B1120]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-20 shadow-sm shadow-black/20">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-black text-white tracking-wide">{title}</h1>
          {usuario?.area && (
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">{usuario.area.nombre}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-white">{usuario?.nombre} {usuario?.apellido_paterno}</p>
          <p className="text-xs text-slate-400 font-medium">@{usuario?.username}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
          <span className="relative z-10">{usuario?.nombre?.[0]}{usuario?.apellido_paterno?.[0]}</span>
        </div>
        <div className="w-px h-8 bg-white/10 mx-1"></div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="!px-3 !py-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </header>
  )
}