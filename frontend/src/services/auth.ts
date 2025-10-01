import { api } from './api'
import { LoginCredentials, AuthResponse, User } from '../types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const { data } = await api.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return data
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  },

  async register(userData: {
    email: string
    full_name: string
    password: string
  }): Promise<User> {
    const { data } = await api.post<User>('/auth/register', userData)
    return data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  setToken(token: string): void {
    localStorage.setItem('token', token)
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },
}