import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'

function tiempoEspera(fechaStr) {
  const diff = Math.floor((new Date() - new Date(fechaStr)) / 60000)
  if (diff < 1) return '< 1 min'
  if (diff === 1) return '1 min'
  return `${diff} min`
}

export default function Ejecutivo() {
  const { usuario } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [turnoActivo, setTurnoActivo] = useState(null)
  const [stats, setStats] = useState({ espera: 0, atendidos: 0, cancelados: 0 })
  const [modalGenero, setModalGenero] = useState(false)
  const [generos, setGeneros] = useState([])
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  // Actualizar reloj cada minuto para el tiempo de espera
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(i)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [turnosRes, generosRes] = await Promise.all([
        api.get('/turno/'),
        api.get('/genero/')
      ])
      const todos = turnosRes.data
      // Filtrar por el área del ejecutivo
      const miArea = usuario?.area?.id
      const enEspera = todos.filter(t => t.estatu?.id === 1 && (!miArea || t.area?.id === miArea))
      const atendidos = todos.filter(t => t.estatu?.id === 2 && (!miArea || t.area?.id === miArea))
      const cancelados = todos.filter(t => t.estatu?.id === 3 && (!miArea || t.area?.id === miArea))
      setTurnos(enEspera)
      setStats({ espera: enEspera.length, atendidos: atendidos.length, cancelados: cancelados.length })
      setGeneros(generosRes.data)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }, [usuario])

  useEffect(() => {
    fetchData()
    const i = setInterval(fetchData, 5000)
    return () => clearInterval(i)
  }, [fetchData])

  const llamarSiguiente = () => {
    const siguiente = turnos[0]
    if (!siguiente) return
    setTurnoActivo(siguiente)
  }

  const abrirModalAtender = () => {
    setGeneroSeleccionado(null)
    setModalGenero(true)
  }

  const confirmarAtender = async () => {
    if (!turnoActivo) return
    try {
      await api.put(`/turno/${turnoActivo.id}/atender`, {
        fk_genero: generoSeleccionado
      })
      setTurnoActivo(null)
      setModalGenero(false)
      fetchData()
    } catch {
      alert('Error al finalizar turno')
    }
  }

  const cancelarTurno = async (id) => {
    try {
      await api.put(`/turno/${id}/cancelar`)
      if (turnoActivo?.id === id) setTurnoActivo(null)
      fetchData()
    } catch {
      alert('Error al cancelar turno')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <Header title="Panel Ejecutivo" />

      <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="En espera"
            value={stats.espera}
            color="text-yellow-400"
            icon={<svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Atendidos hoy"
            value={stats.atendidos}
            color="text-emerald-400"
            icon={<svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Cancelados"
            value={stats.cancelados}
            color="text-red-400"
            icon={<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full min-h-[500px]">
          {/* Panel izquierdo — Turno activo */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 w-full">
            <Card className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">Atendiendo</p>
              </div>

              {turnoActivo ? (
                <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/20 rounded-[2rem] p-8 text-center mb-8 shadow-inner relative overflow-hidden flex-1 flex flex-col items-center justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                    <p className="text-blue-300/80 text-[10px] mb-2 uppercase tracking-[0.3em] font-bold relative z-10">Folio Actual</p>
                    <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter relative z-10">{turnoActivo.folio}</p>
                    <div className="mt-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold relative z-10">
                      {turnoActivo.area?.nombre}
                    </div>
                    <p className="text-slate-400 text-xs mt-4 font-medium relative z-10">
                      Esperando <span className="text-yellow-400 font-bold">{tiempoEspera(turnoActivo.fecha_hora)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button variant="success" size="xl" className="w-full text-base" onClick={abrirModalAtender}>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Finalizar Atención
                    </Button>
                    <Button variant="danger" size="md" className="w-full" onClick={() => cancelarTurno(turnoActivo.id)}>
                      Cancelar Turno
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-medium mb-8">Nadie en atención</p>
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full"
                    onClick={llamarSiguiente}
                    disabled={turnos.length === 0}
                  >
                    Llamar Siguiente
                  </Button>
                </div>
              )}
            </Card>

            {turnoActivo && turnos.length > 0 && (
              <Button variant="secondary" size="lg" className="w-full shrink-0 shadow-2xl animate-in slide-in-from-bottom-2" onClick={llamarSiguiente}>
                Llamar siguiente rápido
              </Button>
            )}
          </div>

          {/* Panel derecho — Cola */}
          <Card className="lg:col-span-8 xl:col-span-9 flex flex-col" padding={false}>
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between z-10 relative bg-white/[0.01]">
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">Cola de espera</p>
              <Badge variant="warning">{turnos.length} en fila</Badge>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : turnos.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">La fila está vacía</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-sm text-left relative">
                  <thead className="text-[10px] text-slate-500 uppercase tracking-widest sticky top-0 bg-[#0F172A] z-20 border-b border-white/5 shadow-sm">
                    <tr>
                      <th className="px-8 py-4 font-bold">#</th>
                      <th className="px-6 py-4 font-bold">Folio</th>
                      <th className="px-6 py-4 font-bold">Servicio</th>
                      <th className="px-6 py-4 font-bold">Tiempo</th>
                      <th className="px-8 py-4 text-right font-bold">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {turnos.map((turno, i) => (
                      <tr
                        key={turno.id}
                        className={`transition-colors duration-200 ${
                          i === 0 ? 'bg-blue-500/[0.03] hover:bg-blue-500/[0.05]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className={`px-8 py-5 text-sm font-black ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                          {i + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className={`font-black text-xl tracking-tight ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                              {turno.folio}
                            </span>
                            {i === 0 && <Badge variant="info">Siguiente</Badge>}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-400 font-medium">{turno.area?.nombre || '—'}</td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            i === 0 ? 'bg-yellow-500/10 text-yellow-500' : 'text-slate-500'
                          }`}>
                            {tiempoEspera(turno.fecha_hora)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => cancelarTurno(turno.id)}
                            className="text-xs font-bold text-slate-500 hover:text-red-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Modal para registrar género */}
      <Modal open={modalGenero} onClose={() => setModalGenero(false)} title="Finalizar Turno">
        <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">
          Para concluir la atención y propósitos estadísticos, selecciona el género de la persona.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {generos.map(g => (
            <button
              key={g.id}
              onClick={() => setGeneroSeleccionado(g.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl border font-bold text-sm transition-all duration-200 ${
                generoSeleccionado === g.id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-inner'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {g.nombre}
            </button>
          ))}
          <button
            onClick={() => setGeneroSeleccionado(null)}
            className={`w-full text-left px-5 py-4 rounded-2xl border text-sm transition-all duration-200 mt-2 ${
              generoSeleccionado === null
                ? 'bg-slate-800/80 border-slate-600 text-white font-bold shadow-inner'
                : 'bg-white/5 border-transparent text-slate-500 hover:border-white/10 hover:text-slate-300'
            }`}
          >
            Prefiero no especificar
          </button>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="lg" className="flex-1" onClick={() => setModalGenero(false)}>
            Cancelar
          </Button>
          <Button variant="success" size="lg" className="flex-1" onClick={confirmarAtender}>
            Cerrar Turno
          </Button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}