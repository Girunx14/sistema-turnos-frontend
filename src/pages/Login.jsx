import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const usuario = await login(form.username, form.password)
      if (!usuario.area) navigate('/admin/dashboard')
      else navigate('/ejecutivo')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Sistema de Turnos</h1>
          <p className="text-slate-400 font-medium">Panel de Acceso</p>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="tu_usuario"
                className="w-full bg-[#0B1120] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none transition-all text-sm shadow-inner"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#0B1120] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none transition-all text-sm shadow-inner"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-red-400 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Autorizando...
                </span>
              ) : 'Ingresar'}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs font-medium mt-8 tracking-wide">
          Sistema de Turnos v1.0 - {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}