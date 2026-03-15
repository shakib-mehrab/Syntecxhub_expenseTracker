import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { DEMO_MODE, STORAGE_KEYS } from '../config'
import { authApi, setAuthToken } from '../services/api'

const AuthContext = createContext(null)

const createDemoAuthPayload = (payload = {}) => ({
  token: 'demo-access-token',
  user: {
    id: 'demo-user',
    name: payload.name || 'Demo User',
    email: payload.email || 'demo@syntecxhub.com',
    isDemo: true,
  },
})

const parseStoredValue = (key) => {
  const value = localStorage.getItem(key)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token) || '')
  const [user, setUser] = useState(() => parseStoredValue(STORAGE_KEYS.user))
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  useEffect(() => {
    setAuthToken(token)

    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.token)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
      return
    }

    localStorage.removeItem(STORAGE_KEYS.user)
  }, [user])

  const login = useCallback(async (credentials) => {
    setIsAuthLoading(true)

    try {
      let response

      try {
        response = await authApi.login(credentials)
      } catch (requestError) {
        if (!DEMO_MODE) {
          throw requestError
        }

        response = createDemoAuthPayload(credentials)
      }

      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  const signup = useCallback(async (payload) => {
    setIsAuthLoading(true)

    try {
      let response

      try {
        response = await authApi.signup(payload)
      } catch (requestError) {
        if (!DEMO_MODE) {
          throw requestError
        }

        response = createDemoAuthPayload(payload)
      }

      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    setAuthToken('')
  }, [])

  const continueWithDemo = useCallback(() => {
    const response = createDemoAuthPayload()
    setToken(response.token)
    setUser(response.user)
    return response
  }, [])

  const updateProfile = useCallback((profileUpdates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser
      }

      return {
        ...currentUser,
        name: profileUpdates.name?.trim() || currentUser.name,
        email: profileUpdates.email?.trim() || currentUser.email,
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isDemoMode: Boolean(user?.isDemo),
      isAuthLoading,
      login,
      signup,
      logout,
      continueWithDemo,
      updateProfile,
    }),
    [continueWithDemo, isAuthLoading, login, logout, signup, token, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }