import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import api from '../api/axios'

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.access_token)
      navigate('/')
    },
    [setAuth, navigate]
  )

  const logout = useCallback(() => {
    clearAuth()
    navigate('/login')
  }, [clearAuth, navigate])

  return { user, isAuthenticated, login, logout }
}
