import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Kiosko from './pages/Kiosko'
import SalaEspera from './pages/SalaEspera'
import PanelAdmin from './pages/PanelAdmin'

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 font-sans">
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-3xl font-black">Sistema de Turnos</h1>
        <p className="text-slate-400 mt-2">Selecciona una vista para continuar</p>
      </div>
      <div className="flex flex-col gap-3 w-64">
        <Link to="/kiosko" className="bg-blue-600 hover:bg-blue-500 text-white text-center font-semibold py-4 rounded-xl transition-all">
          Generar Turno
        </Link>
        <Link to="/sala-espera" className="bg-slate-800 hover:bg-slate-700 text-white text-center font-semibold py-4 rounded-xl transition-all">
          Sala de Espera
        </Link>
        <Link to="/panel" className="bg-slate-800 hover:bg-slate-700 text-white text-center font-semibold py-4 rounded-xl transition-all">
          Panel de Administración
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kiosko" element={<Kiosko />} />
        <Route path="/sala-espera" element={<SalaEspera />} />
        <Route path="/panel" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App