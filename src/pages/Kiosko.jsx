import { useState, useEffect } from 'react'
import api from '../api/axios'
import Button from '../components/ui/Button'

const ICONOS = {
  caja: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  servicio: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  default: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
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
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6 bg-[#0B1120]/60 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-white tracking-wide">Servicios</p>
            <p className="text-sm text-slate-400 capitalize">{fmtFecha(hora)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <p className="text-3xl font-black tabular-nums text-white">{fmtHora(hora)}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-10 py-12 relative z-10">

        {/* Selección de área */}
        {paso === 'seleccion' && (
          <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">¿Qué servicio necesitas?</h1>
              <p className="text-xl text-slate-400">Toca una opción para generar tu turno</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {areas.map(area => (
                  <button
                    key={area.id}
                    onClick={() => { setAreaSeleccionada(area); setPaso('confirmacion') }}
                    className="group relative bg-[#0F172A]/80 backdrop-blur-md border border-white/10 hover:border-blue-500 rounded-[2rem] p-10 text-left transition-all duration-300 hover:scale-[1.02] shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 transition-colors duration-300" />
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-6 transition-all shadow-inner relative z-10">
                      {getIcono(area.nombre)}
                    </div>
                    <div className="relative z-10">
                      <p className="text-3xl font-black text-white mb-2">{area.nombre}</p>
                      <p className="text-lg text-slate-400 font-medium">{area.tipo_area?.nombre}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmación */}
        {paso === 'confirmacion' && (
          <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 mb-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-3">Servicio seleccionado</p>
              <p className="text-4xl font-black text-white leading-tight">{areaSeleccionada?.nombre}</p>
              <p className="text-blue-400 text-sm font-medium mt-2">{areaSeleccionada?.tipo_area?.nombre}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="primary" size="xl" className="w-full" onClick={generarTurno}>
                Confirmar y obtener turno
              </Button>
              <Button variant="ghost" size="lg" className="w-full" onClick={() => setPaso('seleccion')}>
                Volver
              </Button>
            </div>
          </div>
        )}

        {/* Generando */}
        {paso === 'generando' && (
          <div className="text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <p className="text-xl text-slate-300 font-medium">Imprimiendo turno mágico...</p>
          </div>
        )}

        {/* Listo */}
        {paso === 'listo' && turnoGenerado && (
          <div className="w-full max-w-md text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <p className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold mb-4">Tu Folio</p>
              <p className="text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter leading-none drop-shadow-lg mb-6">
                {turnoGenerado.folio}
              </p>
              <div className="h-px bg-white/10 my-6 border-dashed" />
              <p className="text-xl text-white font-bold">{areaSeleccionada?.nombre}</p>
              <p className="text-slate-500 text-sm font-medium mt-2 tabular-nums">
                Generado a las {new Date(turnoGenerado.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <p className="text-blue-200 font-medium mb-6">Espera a que llamen tu folio en la pantalla principal</p>
            <Button variant="secondary" size="lg" className="w-full" onClick={reiniciar}>
              Finalizar
            </Button>
          </div>
        )}
      </main>

      <footer className="relative z-10 px-10 py-5 bg-[#0F172A]/50 backdrop-blur-lg border-t border-white/5 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">Sistema Premium v1.0</p>
        <p className="text-sm font-bold text-blue-400">Ten tu documentación lista</p>
      </footer>
    </div>
  )
}