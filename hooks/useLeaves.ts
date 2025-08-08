import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LeaveService } from '@/services/leave.service'
import { CreateLeaveRequest } from '@/types/leave'
import { useToast } from '@/hooks/use-toast'

export function useLeaveRequests(params?: { employee_id?: string; status?: string }) {
  return useQuery({
    queryKey: ['leave-requests', params],
    queryFn: () => LeaveService.getLeaveRequests(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: ['leave-request', id],
    queryFn: () => LeaveService.getLeaveRequest(id),
    enabled: !!id,
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateLeaveRequest) => LeaveService.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] })
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit leave request',
        variant: 'destructive',
      })
    },
  })
}

export function useApproveLeaveRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => LeaveService.approveLeaveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      toast({
        title: 'Success',
        description: 'Leave request approved successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve leave request',
        variant: 'destructive',
      })
    },
  })
}

export function useRejectLeaveRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      LeaveService.rejectLeaveRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      toast({
        title: 'Success',
        description: 'Leave request rejected successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject leave request',
        variant: 'destructive',
      })
    },
  })
}

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: () => LeaveService.getLeaveTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useLeaveBalances(params: { employee_id: string; year: number }) {
  return useQuery({
    queryKey: ['leave-balances', params],
    queryFn: () => LeaveService.getLeaveBalances(params),
    enabled: !!params.employee_id,
    staleTime: 5 * 60 * 1000,
  })
}
