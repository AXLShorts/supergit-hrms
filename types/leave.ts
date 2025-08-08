import { z } from 'zod'

export const LeaveTypeSchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ar: z.string().optional(),
  annual_days: z.number(),
  carry_forward: z.boolean(),
  max_carry_forward: z.number().optional(),
  gender_specific: z.enum(['All', 'Male', 'Female']).optional(),
  requires_approval: z.boolean(),
  is_paid: z.boolean(),
  created_at: z.string().optional(),
})

export const LeaveRequestSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  leave_type_id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  total_days: z.number(),
  reason: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']),
  approved_by: z.string().optional(),
  approved_at: z.string().optional(),
  rejection_reason: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const CreateLeaveRequestSchema = LeaveRequestSchema.omit({
  id: true,
  total_days: true,
  status: true,
  approved_by: true,
  approved_at: true,
  rejection_reason: true,
  created_at: true,
  updated_at: true,
})

export const LeaveBalanceSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  leave_type_id: z.string(),
  year: z.number(),
  allocated_days: z.number(),
  used_days: z.number(),
  remaining_balance: z.number(),
  carried_forward: z.number().optional(),
})

export const LeaveRequestsResponseSchema = z.array(LeaveRequestSchema)
export const LeaveTypesResponseSchema = z.array(LeaveTypeSchema)
export const LeaveBalancesResponseSchema = z.array(LeaveBalanceSchema)

export type LeaveType = z.infer<typeof LeaveTypeSchema>
export type LeaveRequest = z.infer<typeof LeaveRequestSchema>
export type CreateLeaveRequest = z.infer<typeof CreateLeaveRequestSchema>
export type LeaveBalance = z.infer<typeof LeaveBalanceSchema>
