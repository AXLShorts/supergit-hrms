import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: true,
        })),
      setToken: (token) =>
        set((state) => ({
          token,
        })),
      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper function to check if user has specific role
export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role
}

// Helper function to check if user is admin
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin')
}

// Helper function to check if user is employee
export function isEmployee(user: User | null): boolean {
  return hasRole(user, 'employee')
}
