import { z } from 'zod'

export const ComplianceCheckSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  check_type: z.string(),
  description: z.string(),
  due_date: z.string(),
  completed_date: z.string().optional(),
  status: z.enum(['pending', 'completed', 'overdue', 'not_applicable']),
  compliance_officer: z.string().optional(),
  notes: z.string().optional(),
  documents_required: z.array(z.string()).optional(),
  created_at: z.string().optional(),
})

export const AuditLogSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  action: z.string(),
  resource_type: z.string(),
  resource_id: z.string(),
  old_values: z.record(z.any()).optional(),
  new_values: z.record(z.any()).optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  timestamp: z.string(),
})

export const ComplianceReportSchema = z.object({
  id: z.string(),
  report_type: z.string(),
  generated_by: z.string(),
  generated_at: z.string(),
  period_start: z.string(),
  period_end: z.string(),
  file_path: z.string(),
  status: z.enum(['generating', 'completed', 'failed']),
})

export const ComplianceChecksResponseSchema = z.array(ComplianceCheckSchema)
export const AuditLogsResponseSchema = z.array(AuditLogSchema)
export const ComplianceReportsResponseSchema = z.array(ComplianceReportSchema)

export type ComplianceCheck = z.infer<typeof ComplianceCheckSchema>
export type AuditLog = z.infer<typeof AuditLogSchema>
export type ComplianceReport = z.infer<typeof ComplianceReportSchema>
