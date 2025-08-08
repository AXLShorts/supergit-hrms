import { z } from 'zod'

export const TrainingProgramSchema = z.object({
  id: z.string(),
  title_en: z.string(),
  title_ar: z.string().optional(),
  description_en: z.string(),
  description_ar: z.string().optional(),
  type: z.enum(['Internal', 'External', 'Online', 'Workshop', 'Seminar']),
  category: z.string(),
  duration_hours: z.number(),
  max_participants: z.number().optional(),
  location: z.string().optional(),
  instructor: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  registration_deadline: z.string().optional(),
  cost: z.number().optional(),
  status: z.enum(['Active', 'Inactive', 'Completed', 'Cancelled']),
  created_by: z.string(),
  created_at: z.string().optional(),
})

export const TrainingRequestSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  program_id: z.string(),
  request_type: z.enum(['enrollment', 'nomination', 'self_request']),
  justification: z.string().optional(),
  expected_outcome: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']),
  approved_by: z.string().optional(),
  approved_at: z.string().optional(),
  completion_date: z.string().optional(),
  completion_status: z.enum(['passed', 'failed', 'incomplete']).optional(),
  certificate_issued: z.boolean().optional(),
  feedback_rating: z.number().optional(),
  feedback_comments: z.string().optional(),
  created_at: z.string().optional(),
})

export const CreateTrainingRequestSchema = TrainingRequestSchema.omit({
  id: true,
  status: true,
  approved_by: true,
  approved_at: true,
  completion_date: true,
  completion_status: true,
  certificate_issued: true,
  feedback_rating: true,
  feedback_comments: true,
  created_at: true,
})

export const SkillSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  skill_name: z.string(),
  skill_category: z.string(),
  skill_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  acquired_date: z.string().optional(),
  verified_by: z.string().optional(),
  verification_date: z.string().optional(),
  expiry_date: z.string().optional(),
  created_at: z.string().optional(),
})

export const CreateSkillSchema = SkillSchema.omit({
  id: true,
  verified_by: true,
  verification_date: true,
  created_at: true,
})

export const CertificationSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  certificate_name: z.string(),
  issuer: z.string(),
  issue_date: z.string(),
  expiry_date: z.string().optional(),
  certificate_number: z.string().optional(),
  verification_url: z.string().optional(),
  verified: z.boolean(),
  file_path: z.string().optional(),
  created_at: z.string().optional(),
})

export const TrainingProgramsResponseSchema = z.array(TrainingProgramSchema)
export const TrainingRequestsResponseSchema = z.array(TrainingRequestSchema)
export const SkillsResponseSchema = z.array(SkillSchema)
export const CertificationsResponseSchema = z.array(CertificationSchema)

export type TrainingProgram = z.infer<typeof TrainingProgramSchema>
export type TrainingRequest = z.infer<typeof TrainingRequestSchema>
export type CreateTrainingRequest = z.infer<typeof CreateTrainingRequestSchema>
export type Skill = z.infer<typeof SkillSchema>
export type CreateSkill = z.infer<typeof CreateSkillSchema>
export type Certification = z.infer<typeof CertificationSchema>
