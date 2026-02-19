'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

type AuthContextValue = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)

  const login = useCallback((t: string) => {
    setToken(t)
    if (typeof window !== 'undefined') localStorage.setItem('auth_token', t)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token')
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
