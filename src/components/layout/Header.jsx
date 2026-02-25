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
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-sm font-bold text-white">{title}</h1>
        {usuario?.area && (
          <p className="text-xs text-slate-500">{usuario.area.nombre}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{usuario?.nombre} {usuario?.apellido_paterno}</p>
          <p className="text-xs text-slate-500">@{usuario?.username}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {usuario?.nombre?.[0]}{usuario?.apellido_paterno?.[0]}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </header>
  )
}