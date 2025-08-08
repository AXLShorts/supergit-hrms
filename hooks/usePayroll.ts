import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PayrollService } from '@/services/payroll.service'
import { CreateLoan } from '@/types/payroll'
import { useToast } from '@/hooks/use-toast'

export function usePayslips(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['payslips', params],
    queryFn: () => PayrollService.getPayslips(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePayslip(id: string) {
  return useQuery({
    queryKey: ['payslip', id],
    queryFn: () => PayrollService.getPayslip(id),
    enabled: !!id,
  })
}

export function useSalaryComponents(employeeId: string) {
  return useQuery({
    queryKey: ['salary-components', employeeId],
    queryFn: () => PayrollService.getSalaryComponents(employeeId),
    enabled: !!employeeId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useDownloadPayslip() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => PayrollService.downloadPayslip(id),
    onSuccess: (blob, id) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payslip-${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Success',
        description: 'Payslip downloaded successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to download payslip',
        variant: 'destructive',
      })
    },
  })
}

export function useCreateLoan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateLoan) => PayrollService.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      toast({
        title: 'Success',
        description: 'Loan request submitted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit loan request',
        variant: 'destructive',
      })
    },
  })
}

export function useProcessPayroll() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (params: {
      month: number;
      year: number;
      employee_ids?: string[];
    }) => PayrollService.processPayroll(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] })
      toast({
        title: 'Success',
        description: 'Payroll processed successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to process payroll',
        variant: 'destructive',
      })
    },
  })
}

// Legacy hook for backward compatibility
export function useSalaryStructures(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['salary-structures', params],
    queryFn: () => PayrollService.getSalaryComponents(params?.employee_id || ''),
    enabled: !!params?.employee_id,
    staleTime: 10 * 60 * 1000,
  })
}
