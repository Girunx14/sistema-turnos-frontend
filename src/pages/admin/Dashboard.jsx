import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Header from '../../components/layout/Header'
import StatCard from '../../components/ui/StatCard'
import TurnosPorGenero from '../../components/charts/TurnosPorGenero'
import TurnosPorHora from '../../components/charts/TurnosPorHora'
import TurnosPorArea from '../../components/charts/TurnosPorArea'
import Badge from '../../components/ui/Badge'

export default function Dashboard() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/turno/')
        setTurnos(res.data)
        setLoading(false)
      } catch { setLoading(false) }
    }
    fetch()
    const i = setInterval(fetch, 10000)
    return () => clearInterval(i)
  }, [])

  const atendidos = turnos.filter(t => t.estatu?.id === 2)
  const enEspera = turnos.filter(t => t.estatu?.id === 1)
  const cancelados = turnos.filter(t => t.estatu?.id === 3)

  const tiempoPromedio = () => {
    const conTiempo = atendidos.filter(t => t.fecha_hora_atendida)
    if (!conTiempo.length) return '—'
    const prom = conTiempo.reduce((acc, t) => {
      return acc + (new Date(t.fecha_hora_atendida) - new Date(t.fecha_hora))
    }, 0) / conTiempo.length
    const mins = Math.floor(prom / 60000)
    return `${mins} min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header title="Dashboard Administrativo" />

      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Stats principales */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total hoy"
            value={turnos.length}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard label="Atendidos" value={atendidos.length} color="text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard label="En espera" value={enEspera.length} color="text-yellow-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard label="Tiempo promedio" value={tiempoPromedio()} color="text-blue-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <TurnosPorGenero turnos={atendidos} />
          </div>
          <div className="col-span-2">
            <TurnosPorHora turnos={turnos} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <TurnosPorArea turnos={turnos} />
          </div>

          {/* Tabla últimos turnos */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Últimos turnos</p>
              <Badge variant="default">{turnos.length} total</Badge>
            </div>
            <div className="overflow-y-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-600 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Folio</th>
                    <th className="text-left px-5 py-3">Área</th>
                    <th className="text-left px-5 py-3">Género</th>
                    <th className="text-left px-5 py-3">Hora</th>
                    <th className="text-left px-5 py-3">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[...turnos].reverse().slice(0, 20).map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3 font-bold text-white">{t.folio}</td>
                      <td className="px-5 py-3 text-slate-400">{t.area?.nombre || '—'}</td>
                      <td className="px-5 py-3 text-slate-400">{t.genero?.nombre || '—'}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs tabular-nums">
                        {new Date(t.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-3">
                        {t.estatu?.id === 1 && <Badge variant="warning">En espera</Badge>}
                        {t.estatu?.id === 2 && <Badge variant="success">Atendido</Badge>}
                        {t.estatu?.id === 3 && <Badge variant="danger">Cancelado</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}