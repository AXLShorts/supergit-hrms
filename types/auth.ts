import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'employee']),
  avatar: z.string().optional(),
  department_id: z.string().optional(),
  employee_id: z.string().optional(),
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refresh_token: z.string().optional(),
})

export type LoginRequest = z.infer<typeof LoginSchema>
export type User = z.infer<typeof UserSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
