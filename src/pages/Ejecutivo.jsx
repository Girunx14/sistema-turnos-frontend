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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header title="Panel de Ejecutivo" />

      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="En espera"
            value={stats.espera}
            color="text-yellow-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Atendidos hoy"
            value={stats.atendidos}
            color="text-emerald-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Cancelados"
            value={stats.cancelados}
            color="text-red-400"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        <div className="grid grid-cols-5 gap-6 flex-1">
          {/* Panel izquierdo — Turno activo */}
          <div className="col-span-2 flex flex-col gap-4">
            <Card>
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-4">Atendiendo ahora</p>

              {turnoActivo ? (
                <>
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6 text-center mb-5">
                    <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">Folio</p>
                    <p className="text-6xl font-black text-white tracking-tight">{turnoActivo.folio}</p>
                    <p className="text-blue-400 text-sm mt-2 font-medium">{turnoActivo.area?.nombre}</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Esperando {tiempoEspera(turnoActivo.fecha_hora)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="success" size="lg" className="w-full" onClick={abrirModalAtender}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Finalizar atención
                    </Button>
                    <Button variant="danger" size="md" className="w-full" onClick={() => cancelarTurno(turnoActivo.id)}>
                      Cancelar turno
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-sm mb-5">Sin turno activo</p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={llamarSiguiente}
                    disabled={turnos.length === 0}
                  >
                    Llamar siguiente turno
                  </Button>
                </div>
              )}
            </Card>

            {turnoActivo && (
              <Button variant="secondary" size="md" className="w-full" onClick={llamarSiguiente} disabled={turnos.length === 0}>
                Llamar siguiente
              </Button>
            )}
          </div>

          {/* Panel derecho — Cola */}
          <Card className="col-span-3" padding={false}>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Cola de espera</p>
              <Badge variant="warning">{turnos.length} turnos</Badge>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : turnos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-600 text-sm">Sin turnos en espera</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {/* Header tabla */}
                <div className="grid grid-cols-12 px-6 py-2 text-xs text-slate-600 uppercase tracking-wide">
                  <span className="col-span-1">#</span>
                  <span className="col-span-3">Folio</span>
                  <span className="col-span-4">Área</span>
                  <span className="col-span-2">Espera</span>
                  <span className="col-span-2 text-right">Acción</span>
                </div>
                {turnos.map((turno, i) => (
                  <div
                    key={turno.id}
                    className={`grid grid-cols-12 items-center px-6 py-4 transition-colors ${
                      i === 0 ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                    }`}
                  >
                    <span className={`col-span-1 text-sm font-bold ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                      {i + 1}
                    </span>
                    <div className="col-span-3 flex items-center gap-2">
                      <span className={`font-black text-xl tracking-tight ${i === 0 ? 'text-white' : 'text-slate-300'}`}>
                        {turno.folio}
                      </span>
                      {i === 0 && <Badge variant="info">Próximo</Badge>}
                    </div>
                    <span className="col-span-4 text-slate-400 text-sm">{turno.area?.nombre || '—'}</span>
                    <span className={`col-span-2 text-sm ${i === 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {tiempoEspera(turno.fecha_hora)}
                    </span>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => cancelarTurno(turno.id)}
                        className="text-xs text-slate-600 hover:text-red-400 transition-colors py-1 px-2 rounded hover:bg-red-500/10"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Modal para registrar género */}
      <Modal open={modalGenero} onClose={() => setModalGenero(false)} title="Registrar género del ciudadano">
        <p className="text-slate-400 text-sm mb-5">
          Antes de finalizar, registra el género de la persona atendida. Este dato se usa para estadísticas.
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {generos.map(g => (
            <button
              key={g.id}
              onClick={() => setGeneroSeleccionado(g.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border font-medium text-sm transition-all ${
                generoSeleccionado === g.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              {g.nombre}
            </button>
          ))}
          <button
            onClick={() => setGeneroSeleccionado(null)}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
              generoSeleccionado === null
                ? 'bg-slate-700 border-slate-500 text-white font-medium'
                : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            Prefiero no registrar
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setModalGenero(false)}>
            Cancelar
          </Button>
          <Button variant="success" className="flex-1" onClick={confirmarAtender}>
            Confirmar y finalizar
          </Button>
        </div>
      </Modal>
    </div>
  )
}