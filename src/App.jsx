import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Kiosko from './pages/Kiosko'
import SalaEspera from './pages/SalaEspera'
import PanelAdmin from './pages/PanelAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Kiosko />} />
        <Route path="/sala-espera" element={<SalaEspera />} />
        <Route path="/panel" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App