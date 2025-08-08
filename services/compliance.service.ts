import api from '@/lib/api'
import { 
  ComplianceCheck, 
  AuditLog, 
  ComplianceReport,
  ComplianceChecksResponseSchema,
  AuditLogsResponseSchema,
  ComplianceReportsResponseSchema
} from '@/types/compliance'

export class ComplianceService {
  static async getComplianceChecks(params?: { employee_id?: string }): Promise<ComplianceCheck[]> {
    const response = await api.get('/compliance/checks', { params })
    return ComplianceChecksResponseSchema.parse(response.data)
  }

  static async updateComplianceCheck(id: string, data: Partial<ComplianceCheck>): Promise<ComplianceCheck> {
    const response = await api.put(`/compliance/checks/${id}`, data)
    return response.data
  }

  static async createComplianceCheck(data: Partial<ComplianceCheck>): Promise<ComplianceCheck> {
    const response = await api.post('/compliance/checks', data)
    return response.data
  }

  static async getAuditLogs(params?: { 
    user_id?: string
    resource_type?: string
    start_date?: string
    end_date?: string
  }): Promise<AuditLog[]> {
    const response = await api.get('/compliance/audit-logs', { params })
    return AuditLogsResponseSchema.parse(response.data)
  }

  static async getComplianceReports(): Promise<ComplianceReport[]> {
    const response = await api.get('/compliance/reports')
    return ComplianceReportsResponseSchema.parse(response.data)
  }

  static async generateComplianceReport(data: {
    report_type: string
    period_start: string
    period_end: string
  }): Promise<ComplianceReport> {
    const response = await api.post('/compliance/reports/generate', data)
    return response.data
  }

  static async downloadComplianceReport(id: string): Promise<Blob> {
    const response = await api.get(`/compliance/reports/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
