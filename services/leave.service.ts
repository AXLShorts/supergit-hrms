import api from '@/lib/api'
import { 
  LeaveRequest, 
  LeaveBalance, 
  CreateLeaveRequest,
  LeaveRequestsResponseSchema,
  LeaveBalancesResponseSchema,
  LeaveRequestSchema
} from '@/types/leave'

export class LeaveService {
  static async getLeaveRequests(params?: { employee_id?: string; status?: string }): Promise<LeaveRequest[]> {
    const response = await api.get('/leaves', { params })
    return LeaveRequestsResponseSchema.parse(response.data)
  }

  static async getLeaveRequest(id: string): Promise<LeaveRequest> {
    const response = await api.get(`/leaves/${id}`)
    return LeaveRequestSchema.parse(response.data)
  }

  static async createLeaveRequest(data: CreateLeaveRequest): Promise<LeaveRequest> {
    const response = await api.post('/leaves', data)
    return LeaveRequestSchema.parse(response.data)
  }

  static async updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await api.put(`/leaves/${id}`, data)
    return LeaveRequestSchema.parse(response.data)
  }

  static async approveLeaveRequest(id: string): Promise<LeaveRequest> {
    const response = await api.post(`/leaves/${id}/approve`)
    return LeaveRequestSchema.parse(response.data)
  }

  static async rejectLeaveRequest(id: string, reason?: string): Promise<LeaveRequest> {
    const response = await api.post(`/leaves/${id}/reject`, { reason })
    return LeaveRequestSchema.parse(response.data)
  }

  static async getLeaveBalances(params: { employee_id: string; year: number }): Promise<LeaveBalance[]> {
    const response = await api.get('/leaves/balances', { params })
    return LeaveBalancesResponseSchema.parse(response.data)
  }
}
