import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PerformanceService } from '@/services/performance.service'
import { CreateGoal, CreateFeedback } from '@/types/performance'
import { useToast } from '@/hooks/use-toast'

export function useGoals(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => PerformanceService.getGoals(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateGoal) => PerformanceService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast({
        title: 'Success',
        description: 'Goal created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create goal',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      PerformanceService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast({
        title: 'Success',
        description: 'Goal updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update goal',
        variant: 'destructive',
      })
    },
  })
}

export function useFeedback(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => PerformanceService.getFeedback(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateFeedback() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateFeedback) => PerformanceService.createFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      toast({
        title: 'Success',
        description: 'Feedback submitted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit feedback',
        variant: 'destructive',
      })
    },
  })
}

export function useAppraisals(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['appraisals', params],
    queryFn: () => PerformanceService.getAppraisals(params),
    staleTime: 10 * 60 * 1000,
  })
}
