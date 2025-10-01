import { createContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials } from '../types'
import { authService } from '../services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verifica se há usuário salvo no localStorage ao carregar
    const storedUser = authService.getUser()
    const token = authService.getToken()

    if (storedUser && token) {
      setUser(storedUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const authResponse = await authService.login(credentials)
      authService.setToken(authResponse.access_token)

      // Busca dados reais do usuário após login
      const userData = await authService.getCurrentUser()
      
      authService.setUser(userData)
      setUser(userData)
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}