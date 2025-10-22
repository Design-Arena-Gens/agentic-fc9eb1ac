import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthState, AuthUser } from '../types'

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function getJson (input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const error = new Error(data.message ?? 'Request failed')
    throw error
  }
  return await response.json()
}

interface Props {
  children: React.ReactNode
}

export function AuthProvider ({ children }: Props) {
  const [state, setState] = useState<AuthState>({ authenticated: false, user: null })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getJson('/api/auth/me', { method: 'GET' })
      if (data.authenticated) {
        setState({ authenticated: true, user: data.user as AuthUser })
      } else {
        setState({ authenticated: false, user: null })
      }
    } catch (error) {
      setState({ authenticated: false, user: null })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true)
    try {
      const data = await getJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      setState({ authenticated: true, user: data.user as AuthUser })
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await getJson('/api/auth/logout', { method: 'POST' })
    } finally {
      setState({ authenticated: false, user: null })
      setLoading(false)
    }
  }, [])

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    refresh,
    loading
  }), [state, login, logout, refresh, loading])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
