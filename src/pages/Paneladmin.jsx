import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function PanelAdmin() {
  const [turnos, setTurnos] = useState([])
  const [turnoAtendiendo, setTurnoAtendiendo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hora, setHora] = useState(new Date())
  const [stats, setStats] = useState({ total: 0, atendidos: 0, enEspera: 0 })

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchTurnos = async () => {
    try {
      const res = await api.get('/turno/')
      const todos = res.data
      const enEspera = todos.filter(t => t.estatu?.id === 1)
      const atendidos = todos.filter(t => t.estatu?.id === 2)
      setTurnos(enEspera)
      setStats({
        total: todos.length,
        atendidos: atendidos.length,
        enEspera: enEspera.length,
      })
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTurnos()
    const interval = setInterval(fetchTurnos, 5000)
    return () => clearInterval(interval)
  }, [])

  const llamarSiguiente = async () => {
    const siguiente = turnos[0]
    if (!siguiente) return
    setTurnoAtendiendo(siguiente)
  }

  const finalizarTurno = async () => {
    if (!turnoAtendiendo) return
    try {
      await api.put(`/turno/${turnoAtendiendo.id}/atender`)
      setTurnoAtendiendo(null)
      fetchTurnos()
    } catch (e) {
      alert('Error al finalizar turno')
    }
  }

  const cancelarTurno = async (id) => {
    try {
      await api.put(`/turno/${id}/cancelar`)
      if (turnoAtendiendo?.id === id) setTurnoAtendiendo(null)
      fetchTurnos()
    } catch (e) {
      alert('Error al cancelar turno')
    }
  }

  const formatHora = (d) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  const tiempoEspera = (fechaStr) => {
    const diff = Math.floor((new Date() - new Date(fechaStr)) / 60000)
    if (diff < 1) return '< 1 min'
    return `${diff} min`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Panel de Administración</p>
            <p className="text-xs text-slate-400">Sistema de Turnos</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">En línea</span>
          </div>
          <p className="text-sm font-bold tabular-nums">{formatHora(hora)}</p>
        </div>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total hoy', value: stats.total, color: 'text-white' },
            { label: 'Atendidos', value: stats.atendidos, color: 'text-green-400' },
            { label: 'En espera', value: stats.enEspera, color: 'text-yellow-400' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Panel izquierdo — Turno actual */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Turno en atención */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-4">Atendiendo</p>
              {turnoAtendiendo ? (
                <>
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-center mb-4">
                    <p className="text-slate-400 text-xs mb-1">Folio</p>
                    <p className="text-5xl font-black text-white">{turnoAtendiendo.folio}</p>
                    <p className="text-blue-400 text-sm mt-2">{turnoAtendiendo.area?.nombre}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={finalizarTurno}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl text-sm transition-all active:scale-95"
                    >
                      ✓ Finalizar
                    </button>
                    <button
                      onClick={() => cancelarTurno(turnoAtendiendo.id)}
                      className="flex-1 bg-slate-800 hover:bg-red-900/50 border border-slate-700 hover:border-red-700 text-slate-300 hover:text-red-400 font-semibold py-3 rounded-xl text-sm transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 text-4xl font-black mb-3">---</p>
                  <p className="text-slate-500 text-sm mb-4">Sin turno activo</p>
                  <button
                    onClick={llamarSiguiente}
                    disabled={turnos.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
                  >
                    Llamar siguiente
                  </button>
                </div>
              )}
            </div>

            {/* Botón llamar siguiente si hay turno activo */}
            {turnoAtendiendo && (
              <button
                onClick={llamarSiguiente}
                disabled={turnos.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Llamar siguiente turno
              </button>
            )}
          </div>

          {/* Panel derecho — Cola */}
          <div className="col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-xs uppercase tracking-wide">Cola de espera</p>
              <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                {turnos.length} turnos
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : turnos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-600">Sin turnos en espera</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
                {/* Encabezado tabla */}
                <div className="grid grid-cols-12 text-xs text-slate-600 uppercase tracking-wide px-3 pb-1 border-b border-slate-800">
                  <span className="col-span-1">#</span>
                  <span className="col-span-3">Folio</span>
                  <span className="col-span-4">Área</span>
                  <span className="col-span-2">Espera</span>
                  <span className="col-span-2 text-right">Acción</span>
                </div>
                {turnos.map((turno, i) => (
                  <div
                    key={turno.id}
                    className={`grid grid-cols-12 items-center px-3 py-3 rounded-lg ${
                      i === 0 ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                    } transition-colors`}
                  >
                    <span className="col-span-1 text-slate-600 text-xs">{i + 1}</span>
                    <span className={`col-span-3 font-bold text-lg ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                      {turno.folio}
                    </span>
                    <span className="col-span-4 text-slate-400 text-sm truncate">
                      {turno.area?.nombre || '—'}
                    </span>
                    <span className="col-span-2 text-slate-500 text-xs">
                      {tiempoEspera(turno.fecha_hora)}
                    </span>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => cancelarTurno(turno.id)}
                        className="text-xs text-slate-600 hover:text-red-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}