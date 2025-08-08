import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TrainingService } from '@/services/training.service'
import { CreateTrainingRequest, CreateSkill } from '@/types/training'
import { useToast } from '@/hooks/use-toast'

export function useTrainingPrograms() {
  return useQuery({
    queryKey: ['training-programs'],
    queryFn: () => TrainingService.getTrainingPrograms(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTrainingRequests(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['training-requests', params],
    queryFn: () => TrainingService.getTrainingRequests(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTrainingRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateTrainingRequest) => TrainingService.createTrainingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-requests'] })
      toast({
        title: 'Success',
        description: 'Training request submitted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit training request',
        variant: 'destructive',
      })
    },
  })
}

export function useEmployeeSkills(employeeId: string) {
  return useQuery({
    queryKey: ['employee-skills', employeeId],
    queryFn: () => TrainingService.getEmployeeSkills(employeeId),
    enabled: !!employeeId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useAddEmployeeSkill() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateSkill) => TrainingService.addEmployeeSkill(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-skills', variables.employee_id] })
      toast({
        title: 'Success',
        description: 'Skill added successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add skill',
        variant: 'destructive',
      })
    },
  })
}

export function useEmployeeCertifications(employeeId: string) {
  return useQuery({
    queryKey: ['employee-certifications', employeeId],
    queryFn: () => TrainingService.getEmployeeCertifications(employeeId),
    enabled: !!employeeId,
    staleTime: 10 * 60 * 1000,
  })
}
