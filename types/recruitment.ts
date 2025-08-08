import { z } from 'zod'

export const JobRequisitionSchema = z.object({
  id: z.string(),
  job_title: z.string(),
  department_id: z.string(),
  reporting_manager: z.string(),
  employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern']),
  number_of_vacancies: z.number(),
  job_description: z.string(),
  required_qualifications: z.string(),
  preferred_qualifications: z.string().optional(),
  experience_required: z.string(),
  salary_range_min: z.number().optional(),
  salary_range_max: z.number().optional(),
  location: z.string(),
  urgency: z.enum(['Low', 'Medium', 'High']),
  requested_by: z.string(),
  approved_by: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'closed']),
  created_at: z.string().optional(),
})

export const VacancySchema = z.object({
  id: z.string(),
  requisition_id: z.string(),
  job_title: z.string(),
  department: z.string(),
  location: z.string(),
  employment_type: z.string(),
  description: z.string(),
  requirements: z.string(),
  posted_date: z.string(),
  closing_date: z.string(),
  status: z.enum(['active', 'closed', 'on_hold']),
  applications_count: z.number().optional(),
})

export const ApplicationSchema = z.object({
  id: z.string(),
  vacancy_id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  nationality: z.string(),
  experience_years: z.number(),
  current_salary: z.number().optional(),
  expected_salary: z.number().optional(),
  notice_period: z.string().optional(),
  resume_path: z.string(),
  cover_letter: z.string().optional(),
  status: z.enum(['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected']),
  source: z.enum(['website', 'referral', 'linkedin', 'job_board', 'other']),
  created_at: z.string().optional(),
})

export const InterviewSchema = z.object({
  id: z.string(),
  application_id: z.string(),
  interview_type: z.enum(['phone', 'video', 'in_person', 'technical', 'panel']),
  scheduled_date: z.string(),
  scheduled_time: z.string(),
  duration_minutes: z.number(),
  interviewer_ids: z.array(z.string()),
  location: z.string().optional(),
  meeting_link: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']),
  feedback: z.string().optional(),
  rating: z.number().optional(),
  recommendation: z.enum(['hire', 'reject', 'maybe']).optional(),
  created_at: z.string().optional(),
})

export const JobRequisitionsResponseSchema = z.array(JobRequisitionSchema)
export const VacanciesResponseSchema = z.array(VacancySchema)
export const ApplicationsResponseSchema = z.array(ApplicationSchema)
export const InterviewsResponseSchema = z.array(InterviewSchema)

export type JobRequisition = z.infer<typeof JobRequisitionSchema>
export type Vacancy = z.infer<typeof VacancySchema>
export type Application = z.infer<typeof ApplicationSchema>
export type Interview = z.infer<typeof InterviewSchema>
