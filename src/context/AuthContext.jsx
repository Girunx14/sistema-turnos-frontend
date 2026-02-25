import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    setUsuario(res.data)
    localStorage.setItem('usuario', JSON.stringify(res.data))
    return res.data
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}