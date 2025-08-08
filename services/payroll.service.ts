import api from '@/lib/api'
import { 
  Payslip, 
  SalaryComponent,
  PayslipsResponseSchema,
  SalaryComponentsResponseSchema,
  PayslipSchema
} from '@/types/payroll'

export class PayrollService {
  static async getPayslips(params?: { employee_id?: string }): Promise<Payslip[]> {
    const response = await api.get('/ess/payslips', { params })
    return PayslipsResponseSchema.parse(response.data)
  }

  static async getPayslip(id: string): Promise<Payslip> {
    const response = await api.get(`/ess/payslips/${id}`)
    return PayslipSchema.parse(response.data)
  }

  static async getSalaryComponents(employeeId: string): Promise<SalaryComponent[]> {
    const response = await api.get(`/employees/${employeeId}/salary-components`)
    return SalaryComponentsResponseSchema.parse(response.data)
  }

  static async downloadPayslip(id: string): Promise<Blob> {
    const response = await api.get(`/ess/payslips/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  static async processPayroll(params: {
    month: number;
    year: number;
    employee_ids?: string[];
  }): Promise<void> {
    await api.post('/payroll/process', params)
  }
}
