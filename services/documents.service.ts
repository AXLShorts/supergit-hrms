import api from '@/lib/api'
import { 
  Document, 
  DocumentRequest, 
  CreateDocumentRequest,
  DocumentsResponseSchema,
  DocumentRequestsResponseSchema
} from '@/types/documents'

export class DocumentsService {
  static async getDocuments(params?: { employee_id?: string }): Promise<Document[]> {
    const response = await api.get('/documents', { params })
    return DocumentsResponseSchema.parse(response.data)
  }

  static async uploadDocument(data: FormData): Promise<Document> {
    const response = await api.post('/documents/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  static async downloadDocument(id: string): Promise<Blob> {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  static async deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`)
  }

  static async getDocumentRequests(params?: { employee_id?: string }): Promise<DocumentRequest[]> {
    const response = await api.get('/documents/requests', { params })
    return DocumentRequestsResponseSchema.parse(response.data)
  }

  static async createDocumentRequest(data: CreateDocumentRequest): Promise<DocumentRequest> {
    const response = await api.post('/documents/requests', data)
    return response.data
  }

  static async updateDocumentRequestStatus(id: string, status: string, rejection_reason?: string): Promise<DocumentRequest> {
    const response = await api.put(`/documents/requests/${id}/status`, { 
      status, 
      rejection_reason 
    })
    return response.data
  }

  static async processDocumentRequest(id: string): Promise<DocumentRequest> {
    const response = await api.post(`/documents/requests/${id}/process`)
    return response.data
  }
}
