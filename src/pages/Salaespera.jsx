import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function SalaEspera() {
  const [turnos, setTurnos] = useState([])
  const [hora, setHora] = useState(new Date())
  const [turnoActual, setTurnoActual] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await api.get('/turno/')
        const todos = res.data
        // En espera (estatu id 1) y atendidos recientes (estatu id 2)
        const enEspera = todos.filter(t => t.estatu?.id === 1)
        const atendidos = todos.filter(t => t.estatu?.id === 2)
        // El turno actual es el último atendido
        if (atendidos.length > 0) {
          setTurnoActual(atendidos[atendidos.length - 1])
        }
        setTurnos(enEspera.slice(0, 8))
      } catch (e) {
        console.error(e)
      }
    }
    fetchTurnos()
    const interval = setInterval(fetchTurnos, 5000) // Actualiza cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  const formatHora = (d) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const formatFecha = (d) =>
    d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

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
            <p className="text-base font-semibold">Centro de Servicios</p>
            <p className="text-xs text-slate-400 capitalize">{formatFecha(hora)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black tabular-nums">{formatHora(hora)}</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-5 gap-0">
        {/* Panel izquierdo — Turno actual */}
        <div className="col-span-3 flex flex-col items-center justify-center p-12 border-r border-slate-800">
          <p className="text-slate-500 uppercase text-xs tracking-widest font-semibold mb-4">Atendiendo ahora</p>

          {turnoActual ? (
            <>
              <div className="text-center mb-8">
                <p className="text-slate-400 text-sm mb-2">Número de turno</p>
                <p className="text-9xl font-black text-white tracking-tight leading-none">
                  {turnoActual.folio}
                </p>
              </div>
              <div className="bg-blue-600 rounded-2xl px-10 py-5 text-center">
                <p className="text-blue-200 text-sm mb-1">Dirigirse a</p>
                <p className="text-white text-2xl font-bold">{turnoActual.area?.nombre || 'Módulo'}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-slate-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{turnos.length} personas en espera</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-6xl font-black text-slate-700 mb-4">---</p>
              <p className="text-slate-500">Sin turno activo por el momento</p>
            </div>
          )}
        </div>

        {/* Panel derecho — Cola de espera */}
        <div className="col-span-2 flex flex-col p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 uppercase text-xs tracking-widest font-semibold">En espera</p>
            <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
              {turnos.length}
            </span>
          </div>

          {turnos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-600 text-sm">Sin turnos en espera</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {turnos.map((turno, i) => (
                <div
                  key={turno.id}
                  className={`flex items-center justify-between rounded-xl px-5 py-4 border ${
                    i === 0
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 text-center ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className={`font-bold text-lg ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                        {turno.folio}
                      </p>
                      <p className="text-xs text-slate-500">{turno.area?.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {new Date(turno.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {i === 0 && (
                      <span className="text-xs text-blue-400 font-medium">Próximo</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ticker de aviso */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="bg-blue-950/50 border border-blue-800/30 rounded-xl p-4">
              <p className="text-blue-300 text-xs text-center">
                Por favor ten tu identificación lista al momento de ser atendido
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}