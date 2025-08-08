import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ComplianceService } from '@/services/compliance.service'
import { useToast } from '@/hooks/use-toast'

export function useComplianceChecks(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['compliance-checks', params],
    queryFn: () => ComplianceService.getComplianceChecks(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateComplianceCheck() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ComplianceService.updateComplianceCheck(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-checks'] })
      toast({
        title: 'Success',
        description: 'Compliance check updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update compliance check',
        variant: 'destructive',
      })
    },
  })
}

export function useAuditLogs(params?: { 
  user_id?: string
  resource_type?: string
  start_date?: string
  end_date?: string
}) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => ComplianceService.getAuditLogs(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useComplianceReports() {
  return useQuery({
    queryKey: ['compliance-reports'],
    queryFn: () => ComplianceService.getComplianceReports(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useGenerateComplianceReport() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: {
      report_type: string
      period_start: string
      period_end: string
    }) => ComplianceService.generateComplianceReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-reports'] })
      toast({
        title: 'Success',
        description: 'Compliance report generated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate compliance report',
        variant: 'destructive',
      })
    },
  })
}
