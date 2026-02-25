import { useState, useEffect } from 'react'
import api from '../api/axios'
import Button from '../components/ui/Button'

const ICONOS = {
  caja: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  servicio: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  default: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
}

function getIcono(nombre) {
  const n = nombre?.toLowerCase() || ''
  if (n.includes('caja') || n.includes('pago')) return ICONOS.caja
  if (n.includes('servicio') || n.includes('soporte')) return ICONOS.servicio
  return ICONOS.default
}

export default function Kiosko() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [paso, setPaso] = useState('seleccion') // seleccion | confirmacion | generando | listo
  const [areaSeleccionada, setAreaSeleccionada] = useState(null)
  const [turnoGenerado, setTurnoGenerado] = useState(null)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const i = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    api.get('/area/').then(r => {
      setAreas(r.data)
      setLoading(false)
    })
  }, [])

  const generarTurno = async () => {
    setPaso('generando')
    try {
      const res = await api.post('/turno/', { fk_area_asignada: areaSeleccionada.id })
      setTurnoGenerado(res.data)
      setPaso('listo')
    } catch {
      alert('Error al generar turno')
      setPaso('confirmacion')
    }
  }

  const reiniciar = () => {
    setAreaSeleccionada(null)
    setTurnoGenerado(null)
    setPaso('seleccion')
  }

  const fmtHora = d => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  const fmtFecha = d => d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Centro de Servicios</p>
            <p className="text-xs text-slate-500 capitalize">{fmtFecha(hora)}</p>
          </div>
        </div>
        <p className="text-2xl font-black tabular-nums text-white">{fmtHora(hora)}</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 py-12">

        {/* Selección de área */}
        {paso === 'seleccion' && (
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-white mb-2">Selecciona tu servicio</h1>
              <p className="text-slate-500">Toca una opción para obtener tu turno de atención</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {areas.map(area => (
                  <button
                    key={area.id}
                    onClick={() => { setAreaSeleccionada(area); setPaso('confirmacion') }}
                    className="group bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 rounded-2xl p-8 text-left transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <div className="text-slate-500 group-hover:text-white mb-4 transition-colors">
                      {getIcono(area.nombre)}
                    </div>
                    <p className="text-xl font-bold text-white">{area.nombre}</p>
                    <p className="text-sm text-slate-500 group-hover:text-blue-100 mt-1 transition-colors">
                      {area.tipo_area?.nombre}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmación */}
        {paso === 'confirmacion' && (
          <div className="w-full max-w-sm text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Servicio seleccionado</p>
              <p className="text-2xl font-black text-white mt-2">{areaSeleccionada?.nombre}</p>
              <p className="text-slate-500 text-sm mt-1">{areaSeleccionada?.tipo_area?.nombre}</p>
            </div>
            <Button variant="primary" size="xl" className="w-full mb-3" onClick={generarTurno}>
              Confirmar y obtener turno
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={() => setPaso('seleccion')}>
              Volver
            </Button>
          </div>
        )}

        {/* Generando */}
        {paso === 'generando' && (
          <div className="text-center">
            <div className="w-14 h-14 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Generando tu turno...</p>
          </div>
        )}

        {/* Listo */}
        {paso === 'listo' && turnoGenerado && (
          <div className="w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="bg-slate-900 border-2 border-blue-500/30 rounded-2xl p-10 mb-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Tu número de turno</p>
              <p className="text-8xl font-black text-white tracking-tight leading-none">{turnoGenerado.folio}</p>
              <div className="h-px bg-slate-800 my-5" />
              <p className="text-slate-400 text-sm">{areaSeleccionada?.nombre}</p>
              <p className="text-slate-600 text-xs mt-1">
                {new Date(turnoGenerado.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <p className="text-slate-500 text-sm mb-5">Espera a que llamen tu turno en pantalla</p>
            <Button variant="secondary" size="md" className="w-full" onClick={reiniciar}>
              Nuevo turno
            </Button>
          </div>
        )}
      </main>

      <footer className="px-10 py-4 border-t border-slate-800/60 flex items-center justify-between">
        <p className="text-xs text-slate-700">Sistema de Turnos v1.0</p>
        <p className="text-xs text-slate-700">Ten tu identificación lista</p>
      </footer>
    </div>
  )
}