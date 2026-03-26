import { useState, useEffect } from 'react'
import api from '../api/axios'

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
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
    const i = setInterval(fetch, 4000)
    return () => clearInterval(i)
  }, [])

  const fmtHora = d => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmtFecha = d => d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 bg-[#0B1120]/60 backdrop-blur-xl border-b border-white/5 shadow-sm shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Centro de Servicios</h1>
            <p className="text-sm text-slate-400 capitalize font-medium mt-0.5">{fmtFecha(hora)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <p className="text-3xl font-black text-white tabular-nums tracking-tight">{fmtHora(hora)}</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 relative z-10 lg:max-h-[calc(100vh-100px)]">
        
        {/* Panel Izquierdo — Turno actual */}
        <div className="lg:col-span-8 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          
          <div className="p-8 pb-0 flex justify-between items-center z-10">
            <h2 className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold">Atendiendo Ahora</h2>
            <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              Módulo Principal
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-12 z-10">
            {turnoActual ? (
              <div className="flex flex-col items-center w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-12 relative w-full">
                  <p className="text-slate-500 text-lg mb-4 font-medium">Turno Número</p>
                  <div className="relative inline-block">
                    <span className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full" />
                    <p className="relative text-[12rem] md:text-[15rem] xl:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter leading-none drop-shadow-2xl">
                      {turnoActual.folio}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 relative overflow-hidden group shadow-2xl shadow-blue-900/40 transform transition-transform duration-300 hover:scale-[1.02]">
                  <div className="bg-slate-900/40 backdrop-blur-md rounded-[22px] px-12 py-8 text-center border border-white/10 relative z-10 transition-colors group-hover:bg-slate-900/30">
                    <p className="text-blue-200 text-lg mb-2 font-medium">Favor de pasar a</p>
                    <p className="text-white text-5xl md:text-6xl font-black tracking-tight">{turnoActual.area?.nombre || 'Módulo'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center justify-center h-full opacity-60">
                <div className="w-24 h-24 mb-6 rounded-full bg-slate-800/50 flex items-center justify-center shadow-inner">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-7xl md:text-8xl font-black text-slate-700 tracking-tighter mb-4">---</p>
                <p className="text-xl md:text-2xl text-slate-500 font-medium">Esperando próximo turno...</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho — Cola */}
        <div className="lg:col-span-4 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 z-10">
            <h2 className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold">En Espera</h2>
            <div className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-bold shadow-inner border border-white/5">
              {enEspera.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 z-10 custom-scrollbar">
            {enEspera.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-slate-400 font-medium">No hay turnos en espera</p>
              </div>
            ) : (
              enEspera.map((turno, i) => (
                <div
                  key={turno.id}
                  className={`group flex items-center justify-between rounded-2xl p-4 transition-all duration-300 ${
                    i === 0
                      ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 shadow-lg shadow-blue-900/20 md:scale-[1.02] transform'
                      : 'bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      i === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className={`font-black text-2xl tracking-tight leading-none mb-1 ${
                        i === 0 ? 'text-white' : 'text-slate-200'
                      }`}>
                        {turno.folio}
                      </p>
                      <p className={`text-xs font-medium ${
                        i === 0 ? 'text-blue-200/80' : 'text-slate-500'
                      }`}>
                        {turno.area?.nombre || 'General'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-center">
                    {i === 0 && (
                      <span className="mb-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        Próximo
                      </span>
                    )}
                    <p className="text-sm text-slate-500 font-medium tabular-nums">
                      {new Date(turno.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 z-10">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-emerald-300 text-sm font-medium leading-relaxed">
                Por favor, ten tu identificación e información lista al ser llamado.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  )
}