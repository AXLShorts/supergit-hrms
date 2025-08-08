import api from '@/lib/api'
import { 
  AttendanceRecord, 
  ClockInOut,
  AttendanceRecordsResponseSchema,
  AttendanceRecordSchema
} from '@/types/attendance'

export class AttendanceService {
  static async getAttendanceRecords(params?: { 
    employee_id?: string; 
    start_date?: string; 
    end_date?: string 
  }): Promise<AttendanceRecord[]> {
    const response = await api.get('/attendance', { params })
    return AttendanceRecordsResponseSchema.parse(response.data)
  }

  static async clockInOut(data: ClockInOut): Promise<AttendanceRecord> {
    const response = await api.post('/attendance/clock', data)
    return AttendanceRecordSchema.parse(response.data)
  }

  static async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    const today = new Date().toISOString().split('T')[0]
    const response = await api.get('/attendance', {
      params: { employee_id: employeeId, date: today }
    })
    const records = AttendanceRecordsResponseSchema.parse(response.data)
    return records[0] || null
  }

  static async getAttendanceSummary(params: {
    employee_id: string;
    month: number;
    year: number;
  }): Promise<{
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    total_hours: number;
  }> {
    const response = await api.get('/attendance/summary', { params })
    return response.data
  }
}
