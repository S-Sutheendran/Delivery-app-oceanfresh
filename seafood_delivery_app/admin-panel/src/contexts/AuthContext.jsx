import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = sessionStorage.getItem('of_admin')
    return stored ? JSON.parse(stored) : null
  })

  const login = (username) => {
    const user = { username, name: 'Admin User', role: 'Super Admin', avatar: null }
    sessionStorage.setItem('of_admin', JSON.stringify(user))
    setAdmin(user)
  }

  const logout = () => {
    sessionStorage.removeItem('of_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
