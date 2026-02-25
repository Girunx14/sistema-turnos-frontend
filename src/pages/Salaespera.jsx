import { useState, useEffect } from 'react'
import api from '../api/axios'
import Badge from '../components/ui/Badge'

export default function SalaEspera() {
  const [enEspera, setEnEspera] = useState([])
  const [turnoActual, setTurnoActual] = useState(null)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const i = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/turno/')
        const todos = res.data
        const espera = todos.filter(t => t.estatu?.id === 1)
        const atendidos = todos.filter(t => t.estatu?.id === 2)
        setEnEspera(espera.slice(0, 8))
        if (atendidos.length > 0) setTurnoActual(atendidos[atendidos.length - 1])
      } catch (e) { console.error(e) }
    }
    fetch()
    const i = setInterval(fetch, 4000)
    return () => clearInterval(i)
  }, [])

  const fmtHora = d => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmtFecha = d => d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold">Centro de Servicios</p>
            <p className="text-xs text-slate-500 capitalize">{fmtFecha(hora)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-3xl font-black tabular-nums">{fmtHora(hora)}</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-5">
        {/* Panel izquierdo — Turno actual */}
        <div className="col-span-3 flex flex-col items-center justify-center p-14 border-r border-slate-800">
          <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-8">Atendiendo ahora</p>

          {turnoActual ? (
            <>
              <div className="text-center mb-10">
                <p className="text-slate-500 text-sm mb-3">Número de turno</p>
                <p className="text-[10rem] font-black text-white tracking-tight leading-none">
                  {turnoActual.folio}
                </p>
              </div>
              <div className="bg-blue-600 rounded-2xl px-12 py-5 text-center shadow-lg shadow-blue-600/20">
                <p className="text-blue-200 text-sm mb-1">Dirigirse a</p>
                <p className="text-white text-3xl font-black">{turnoActual.area?.nombre || 'Módulo'}</p>
              </div>
              <p className="text-slate-600 text-sm mt-6">
                {enEspera.length} {enEspera.length === 1 ? 'persona' : 'personas'} en espera
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-8xl font-black text-slate-800 mb-4">---</p>
              <p className="text-slate-600">Sin turno activo por el momento</p>
            </div>
          )}
        </div>

        {/* Panel derecho — Cola */}
        <div className="col-span-2 flex flex-col p-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">En espera</p>
            <Badge variant="warning">{enEspera.length}</Badge>
          </div>

          {enEspera.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-700 text-sm">Sin turnos en espera</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {enEspera.map((turno, i) => (
                <div
                  key={turno.id}
                  className={`flex items-center justify-between rounded-xl px-5 py-4 border ${
                    i === 0
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 ${i === 0 ? 'text-blue-400' : 'text-slate-700'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`font-black text-xl ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                        {turno.folio}
                      </p>
                      <p className="text-xs text-slate-600">{turno.area?.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600">
                      {new Date(turno.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {i === 0 && <span className="text-xs text-blue-400 font-semibold">Próximo</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-blue-950/30 border border-blue-900/20 rounded-xl p-4">
              <p className="text-blue-400/70 text-xs text-center">
                Por favor ten tu identificación lista al ser atendido
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}