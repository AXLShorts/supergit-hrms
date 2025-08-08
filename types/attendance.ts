import { z } from 'zod'

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  date: z.string(),
  clock_in: z.string().optional(),
  clock_out: z.string().optional(),
  break_start: z.string().optional(),
  break_end: z.string().optional(),
  total_hours: z.number().optional(),
  overtime_hours: z.number().optional(),
  status: z.enum(['Present', 'Absent', 'Late', 'Partial']),
  location: z.string().optional(),
  device_info: z.string().optional(),
  created_at: z.string().optional(),
})

export const ClockInOutSchema = z.object({
  employee_id: z.string(),
  action: z.enum(['clock_in', 'clock_out', 'break_start', 'break_end']),
  timestamp: z.string(),
  location: z.string().optional(),
  device_info: z.string().optional(),
})

export const ShiftSchema = z.object({
  id: z.string(),
  name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  break_duration: z.number(),
  is_flexible: z.boolean(),
  grace_period: z.number(),
})

export const OvertimeRequestSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  hours: z.number(),
  reason: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  approved_by: z.string().optional(),
  created_at: z.string().optional(),
})

export const CreateOvertimeRequestSchema = OvertimeRequestSchema.omit({
  id: true,
  status: true,
  approved_by: true,
  created_at: true,
})

export const AttendanceRecordsResponseSchema = z.array(AttendanceRecordSchema)
export const ShiftsResponseSchema = z.array(ShiftSchema)
export const OvertimeRequestsResponseSchema = z.array(OvertimeRequestSchema)

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>
export type ClockInOut = z.infer<typeof ClockInOutSchema>
export type Shift = z.infer<typeof ShiftSchema>
export type OvertimeRequest = z.infer<typeof OvertimeRequestSchema>
export type CreateOvertimeRequest = z.infer<typeof CreateOvertimeRequestSchema>

// Legacy types for backward compatibility
export type AttendanceLog = AttendanceRecord
export type ClockInRequest = { employee_id: string; method: string; location: string }
export type ClockOutRequest = { employee_id: string; method: string; location: string }
