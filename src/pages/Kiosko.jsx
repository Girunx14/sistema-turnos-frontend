import { useState, useEffect } from 'react'
import api from '../api/axios'

const iconos = {
  default: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  caja: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  servicio: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

function getIcono(nombre) {
  const n = nombre?.toLowerCase() || ''
  if (n.includes('caja') || n.includes('pago')) return iconos.caja
  if (n.includes('servicio') || n.includes('soporte')) return iconos.servicio
  return iconos.default
}

export default function Kiosko() {
  const [areas, setAreas] = useState([])
  const [generos, setGeneros] = useState([])
  const [loading, setLoading] = useState(true)
  const [paso, setPaso] = useState('seleccion') // seleccion | genero | confirmacion | imprimiendo
  const [areaSeleccionada, setAreaSeleccionada] = useState(null)
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null)
  const [turnoGenerado, setTurnoGenerado] = useState(null)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    Promise.all([api.get('/area/'), api.get('/genero/')]).then(([areasRes, generosRes]) => {
      setAreas(areasRes.data)
      setGeneros(generosRes.data)
      setLoading(false)
    })
  }, [])

  const seleccionarArea = (area) => {
    setAreaSeleccionada(area)
    setPaso('genero')
  }

  const seleccionarGenero = (genero) => {
    setGeneroSeleccionado(genero)
    setPaso('confirmacion')
  }

  const generarTurno = async () => {
    setPaso('imprimiendo')
    try {
      const res = await api.post('/turno/', {
        fk_area_asignada: areaSeleccionada.id,
        fk_genero: generoSeleccionado.id,
      })
      setTurnoGenerado(res.data)
    } catch (e) {
      alert('Error al generar turno')
      setPaso('confirmacion')
    }
  }

  const reiniciar = () => {
    setAreaSeleccionada(null)
    setGeneroSeleccionado(null)
    setTurnoGenerado(null)
    setPaso('seleccion')
  }

  const formatHora = (d) =>
    d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  const formatFecha = (d) =>
    d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Centro de Servicios</p>
            <p className="text-xs text-slate-400">Sistema de Turnos</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-white">{formatHora(hora)}</p>
          <p className="text-xs text-slate-400 capitalize">{formatFecha(hora)}</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-10 py-12">

        {/* PASO: Selección de área */}
        {paso === 'seleccion' && (
          <div className="w-full max-w-3xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Selecciona tu servicio</h1>
              <p className="text-slate-400">Toca una opción para obtener tu turno</p>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => seleccionarArea(area)}
                    className="group bg-slate-900 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-2xl p-7 text-left transition-all duration-200 active:scale-95"
                  >
                    <div className="text-slate-400 group-hover:text-white mb-4 transition-colors">
                      {getIcono(area.nombre)}
                    </div>
                    <p className="text-lg font-semibold text-white">{area.nombre}</p>
                    <p className="text-sm text-slate-400 group-hover:text-blue-100 mt-1 transition-colors">
                      {area.tipo_area?.nombre}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PASO: Selección de género */}
        {paso === 'genero' && (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-10">
              <p className="text-blue-400 text-sm font-medium mb-2">Servicio seleccionado: <span className="text-white">{areaSeleccionada?.nombre}</span></p>
              <h1 className="text-3xl font-bold text-white mb-2">¿Cómo te identificas?</h1>
              <p className="text-slate-400">Este dato es opcional y solo con fines estadísticos</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {generos.map((g) => (
                <button
                  key={g.id}
                  onClick={() => seleccionarGenero(g)}
                  className="bg-slate-900 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 rounded-xl px-6 py-4 text-left font-medium transition-all duration-150 active:scale-95"
                >
                  {g.nombre}
                </button>
              ))}
              <button
                onClick={() => { setGeneroSeleccionado({ id: null }); setPaso('confirmacion') }}
                className="bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl px-6 py-4 text-left text-slate-400 font-medium transition-all duration-150 active:scale-95"
              >
                Prefiero no decirlo
              </button>
            </div>
            <button onClick={() => setPaso('seleccion')} className="mt-6 text-slate-500 hover:text-white text-sm transition-colors">
              ← Volver
            </button>
          </div>
        )}

        {/* PASO: Confirmación */}
        {paso === 'confirmacion' && (
          <div className="w-full max-w-md text-center">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-6">
              <p className="text-slate-400 text-sm mb-1">Servicio</p>
              <p className="text-xl font-bold text-white mb-4">{areaSeleccionada?.nombre}</p>
              <div className="h-px bg-slate-700 mb-4" />
              <p className="text-slate-400 text-sm mb-1">Tipo</p>
              <p className="text-white font-medium">{areaSeleccionada?.tipo_area?.nombre}</p>
            </div>
            <button
              onClick={generarTurno}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg transition-all active:scale-95 mb-3"
            >
              Generar Turno
            </button>
            <button onClick={() => setPaso('genero')} className="text-slate-500 hover:text-white text-sm transition-colors">
              ← Volver
            </button>
          </div>
        )}

        {/* PASO: Turno generado */}
        {paso === 'imprimiendo' && turnoGenerado && (
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 font-medium">¡Turno generado!</p>
            </div>
            <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-10 mb-6">
              <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">Tu número de turno</p>
              <p className="text-7xl font-black text-white tracking-tight">{turnoGenerado.folio}</p>
              <div className="h-px bg-slate-700 my-6" />
              <p className="text-slate-400 text-sm">{areaSeleccionada?.nombre}</p>
              <p className="text-xs text-slate-600 mt-1">
                {new Date(turnoGenerado.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <p className="text-slate-400 text-sm mb-6">Por favor espera a que llamen tu turno</p>
            <button
              onClick={reiniciar}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all active:scale-95"
            >
              Nuevo turno
            </button>
          </div>
        )}

        {/* Loading mientras genera */}
        {paso === 'imprimiendo' && !turnoGenerado && (
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Generando tu turno...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-10 py-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-600">Sistema de Turnos v1.0</p>
        <p className="text-xs text-slate-600">Por favor ten tu identificación lista</p>
      </footer>
    </div>
  )
}