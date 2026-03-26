import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Header from '../../components/layout/Header'
import StatCard from '../../components/ui/StatCard'
import TurnosPorGenero from '../../components/charts/TurnosPorGenero'
import TurnosPorHora from '../../components/charts/TurnosPorHora'
import TurnosPorArea from '../../components/charts/TurnosPorArea'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'

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
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <Header title="Dashboard Administrativo" />

      <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 relative z-10 custom-scrollbar overflow-x-hidden">
        {/* Stats principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total hoy"
            value={turnos.length}
            icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
          <StatCard label="Atendidos" value={atendidos.length} color="text-emerald-400"
            icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard label="En espera" value={enEspera.length} color="text-yellow-400"
            icon={<svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard label="Tiempo promedio" value={tiempoPromedio()} color="text-indigo-400"
            icon={<svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 border-white/5 opacity-90 transition-opacity hover:opacity-100 p-0 overflow-hidden">
            <div className="h-full p-4">
              <TurnosPorGenero turnos={atendidos} />
            </div>
          </Card>
          <Card className="col-span-1 lg:col-span-2 border-white/5 opacity-90 transition-opacity hover:opacity-100 p-0 overflow-hidden">
            <div className="h-full p-4">
              <TurnosPorHora turnos={turnos} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 border-white/5 opacity-90 transition-opacity hover:opacity-100 p-0 overflow-hidden">
            <div className="h-full p-4">
              <TurnosPorArea turnos={turnos} />
            </div>
          </Card>

          {/* Tabla últimos turnos */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col h-full opacity-90 transition-opacity hover:opacity-100" padding={false}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">Últimos turnos</p>
              <Badge variant="default">{turnos.length} historial</Badge>
            </div>
            <div className="overflow-y-auto max-h-[300px] custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-500 uppercase tracking-widest sticky top-0 bg-[#0F172A] z-20 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold">Folio</th>
                    <th className="px-6 py-4 font-bold">Área</th>
                    <th className="px-6 py-4 font-bold hidden sm:table-cell">Género</th>
                    <th className="px-6 py-4 font-bold">Hora</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...turnos].reverse().slice(0, 30).map((t, i) => (
                    <tr key={t.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 font-black text-white">{t.folio}</td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{t.area?.nombre || '—'}</td>
                      <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{t.genero?.nombre || '—'}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs tabular-nums">
                        {new Date(t.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        {t.estatu?.id === 1 && <Badge variant="warning">En espera</Badge>}
                        {t.estatu?.id === 2 && <Badge variant="success">Atendido</Badge>}
                        {t.estatu?.id === 3 && <Badge variant="danger">Cancelado</Badge>}
                      </td>
                    </tr>
                  ))}
                  {turnos.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                          No hay turnos registrados aún.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}