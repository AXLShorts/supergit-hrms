import api from '@/lib/api'
import { LoginRequest, AuthResponse, User, AuthResponseSchema, UserSchema } from '@/types/auth'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return AuthResponseSchema.parse(response.data)
  }

  static async logout(): Promise<void> {
    await api.post('/auth/logout')
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return AuthResponseSchema.parse(response.data)
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return UserSchema.parse(response.data)
  }

  static async changePassword(data: {
    current_password: string
    new_password: string
    confirm_password: string
  }): Promise<void> {
    await api.post('/auth/change-password', data)
  }

  static async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  }

  static async resetPassword(data: {
    token: string
    password: string
    confirm_password: string
  }): Promise<void> {
    await api.post('/auth/reset-password', data)
  }
}
