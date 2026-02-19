'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getStoredAuth, setStoredAuth, clearStoredAuth, type AuthTokens, type User } from '@/lib/auth'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginSuccess: (data: AuthTokens) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredAuth()
    setUser(stored?.user ?? null)
    setIsLoading(false)
  }, [])

  const loginSuccess = useCallback((data: AuthTokens) => {
    setStoredAuth(data)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
