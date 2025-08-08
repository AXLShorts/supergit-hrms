import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EmployeeService } from '@/services/employee.service'
import { CreateEmployee, UpdateEmployee } from '@/types/employee'
import { useToast } from '@/hooks/use-toast'

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => EmployeeService.getEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => EmployeeService.getEmployee(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateEmployee) => EmployeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast({
        title: 'Success',
        description: 'Employee created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create employee',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployee }) =>
      EmployeeService.updateEmployee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update employee',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => EmployeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete employee',
        variant: 'destructive',
      })
    },
  })
}

export function useEmployeeDocuments(employeeId: string) {
  return useQuery({
    queryKey: ['employee-documents', employeeId],
    queryFn: () => EmployeeService.getEmployeeDocuments(employeeId),
    enabled: !!employeeId,
  })
}
