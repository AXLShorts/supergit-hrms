import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AttendanceService } from '@/services/attendance.service'
import { ClockInOut } from '@/types/attendance'
import { useToast } from '@/hooks/use-toast'

export function useAttendanceRecords(params?: { 
  employee_id?: string; 
  start_date?: string; 
  end_date?: string 
}) {
  return useQuery({
    queryKey: ['attendance-records', params],
    queryFn: () => AttendanceService.getAttendanceRecords(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTodayAttendance(employeeId: string) {
  return useQuery({
    queryKey: ['today-attendance', employeeId],
    queryFn: () => AttendanceService.getTodayAttendance(employeeId),
    enabled: !!employeeId,
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useClockInOut() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: ClockInOut) => AttendanceService.clockInOut(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] })
      queryClient.invalidateQueries({ queryKey: ['today-attendance', variables.employee_id] })
      
      const action = variables.action.replace('_', ' ')
      toast({
        title: 'Success',
        description: `Successfully ${action}`,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to record attendance',
        variant: 'destructive',
      })
    },
  })
}

export function useAttendanceSummary(params: {
  employee_id: string;
  month: number;
  year: number;
}) {
  return useQuery({
    queryKey: ['attendance-summary', params],
    queryFn: () => AttendanceService.getAttendanceSummary(params),
    enabled: !!params.employee_id,
    staleTime: 5 * 60 * 1000,
  })
}

// Legacy hooks for backward compatibility
export function useAttendanceLogs(params?: { employee_id?: string; date?: string }) {
  return useAttendanceRecords(params)
}

export function useClockIn() {
  const clockInOut = useClockInOut()
  
  return {
    ...clockInOut,
    mutate: (data: { employee_id: string; method: string; location: string }) =>
      clockInOut.mutate({
        employee_id: data.employee_id,
        action: 'clock_in',
        timestamp: new Date().toISOString(),
        location: data.location,
        device_info: data.method,
      }),
  }
}

export function useClockOut() {
  const clockInOut = useClockInOut()
  
  return {
    ...clockInOut,
    mutate: (data: { employee_id: string; method: string; location: string }) =>
      clockInOut.mutate({
        employee_id: data.employee_id,
        action: 'clock_out',
        timestamp: new Date().toISOString(),
        location: data.location,
        device_info: data.method,
      }),
  }
}
