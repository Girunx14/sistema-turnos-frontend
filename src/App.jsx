import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Kiosko from './pages/kiosko'
import SalaEspera from './pages/Salaespera'
import Ejecutivo from './pages/Ejecutivo'
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/kiosko" element={<Kiosko />} />
          <Route path="/sala-espera" element={<SalaEspera />} />

          {/* Rutas protegidas */}
          <Route path="/ejecutivo" element={
            <ProtectedRoute><Ejecutivo /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          {/* Redirect raíz */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App