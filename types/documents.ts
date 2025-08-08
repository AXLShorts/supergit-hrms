import { z } from 'zod'

export const DocumentSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  document_type: z.string(),
  document_name: z.string(),
  file_path: z.string(),
  file_size: z.number(),
  mime_type: z.string(),
  uploaded_by: z.string(),
  upload_date: z.string(),
  expiry_date: z.string().optional(),
  status: z.enum(['active', 'expired', 'archived']),
  is_confidential: z.boolean(),
  access_level: z.enum(['public', 'internal', 'confidential', 'restricted']),
  version: z.number(),
  tags: z.array(z.string()).optional(),
  created_at: z.string().optional(),
})

export const DocumentRequestSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  document_type: z.enum(['salary_certificate', 'employment_letter', 'experience_certificate', 'no_objection_certificate', 'other']),
  purpose: z.string(),
  urgency: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']),
  requested_at: z.string(),
  completed_at: z.string().optional(),
  processed_by: z.string().optional(),
  rejection_reason: z.string().optional(),
  document_id: z.string().optional(),
})

export const CreateDocumentRequestSchema = DocumentRequestSchema.omit({
  id: true,
  status: true,
  requested_at: true,
  completed_at: true,
  processed_by: true,
  rejection_reason: true,
  document_id: true,
}).extend({
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
})

export const DocumentsResponseSchema = z.array(DocumentSchema)
export const DocumentRequestsResponseSchema = z.array(DocumentRequestSchema)

export type Document = z.infer<typeof DocumentSchema>
export type DocumentRequest = z.infer<typeof DocumentRequestSchema>
export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>
