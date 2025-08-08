import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RecruitmentService } from '@/services/recruitment.service'
import { useToast } from '@/hooks/use-toast'

export function useJobRequisitions() {
  return useQuery({
    queryKey: ['job-requisitions'],
    queryFn: () => RecruitmentService.getJobRequisitions(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateJobRequisition() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => RecruitmentService.createJobRequisition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-requisitions'] })
      toast({
        title: 'Success',
        description: 'Job requisition created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create job requisition',
        variant: 'destructive',
      })
    },
  })
}

export function useVacancies() {
  return useQuery({
    queryKey: ['vacancies'],
    queryFn: () => RecruitmentService.getVacancies(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useApplications(params?: { vacancy_id?: string }) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => RecruitmentService.getApplications(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      RecruitmentService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast({
        title: 'Success',
        description: 'Application status updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update application status',
        variant: 'destructive',
      })
    },
  })
}

export function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => RecruitmentService.getInterviews(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useScheduleInterview() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: any) => RecruitmentService.scheduleInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      toast({
        title: 'Success',
        description: 'Interview scheduled successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to schedule interview',
        variant: 'destructive',
      })
    },
  })
}
