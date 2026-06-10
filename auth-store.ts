import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  login: (name: string, email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Login failed')
          }

          const user = await response.json()
          set({ user, isLoading: false })
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Registration failed')
          }

          const user = await response.json()
          set({ user, isLoading: false })
        } catch (error) {
          console.error('[v0] Registration error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        fetch('/api/auth/session', { method: 'POST' }).catch(() => null)
        set({ user: null })
      },

      checkSession: async () => {
        try {
          const response = await fetch('/api/auth/session')
          if (response.ok) {
            const user = await response.json()
            set({ user })
          }
        } catch (error) {
          console.error('Session check error:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
