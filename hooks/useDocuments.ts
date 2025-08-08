import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentsService } from '@/services/documents.service'
import { CreateDocumentRequest } from '@/types/documents'
import { useToast } from '@/hooks/use-toast'

export function useDocuments(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => DocumentsService.getDocuments(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: FormData) => DocumentsService.uploadDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload document',
        variant: 'destructive',
      })
    },
  })
}

export function useDownloadDocument() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) => DocumentsService.downloadDocument(id),
    onSuccess: (blob, id) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `document-${id}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Success',
        description: 'Document downloaded successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to download document',
        variant: 'destructive',
      })
    },
  })
}

export function useDocumentRequests(params?: { employee_id?: string }) {
  return useQuery({
    queryKey: ['document-requests', params],
    queryFn: () => DocumentsService.getDocumentRequests(params),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateDocumentRequest() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) => DocumentsService.createDocumentRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] })
      toast({
        title: 'Success',
        description: 'Document request submitted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit document request',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateDocumentRequestStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, status, rejection_reason }: { 
      id: string; 
      status: string; 
      rejection_reason?: string 
    }) => DocumentsService.updateDocumentRequestStatus(id, status, rejection_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-requests'] })
      toast({
        title: 'Success',
        description: 'Document request status updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update document request status',
        variant: 'destructive',
      })
    },
  })
}
