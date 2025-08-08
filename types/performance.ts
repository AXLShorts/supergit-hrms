import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  title: z.string(),
  description: z.string(),
  kpi_metric: z.string(),
  target_value: z.number(),
  achieved_value: z.number().optional(),
  weight: z.number(),
  period_start: z.string(),
  period_end: z.string(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  created_by: z.string(),
  approved_by: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const CreateGoalSchema = GoalSchema.omit({
  id: true,
  achieved_value: true,
  status: true,
  approved_by: true,
  created_at: true,
  updated_at: true,
})

export const FeedbackSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  reviewer_id: z.string(),
  role: z.enum(['manager', 'peer', 'subordinate', 'self']),
  feedback_type: z.enum(['performance', 'behavioral', 'development']),
  rating: z.number().min(1).max(5),
  feedback_text: z.string(),
  strengths: z.string().optional(),
  areas_for_improvement: z.string().optional(),
  development_suggestions: z.string().optional(),
  period: z.string(),
  is_anonymous: z.boolean(),
  created_at: z.string().optional(),
})

export const CreateFeedbackSchema = FeedbackSchema.omit({
  id: true,
  created_at: true,
})

export const AppraisalSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  cycle_name: z.string(),
  cycle_start: z.string(),
  cycle_end: z.string(),
  self_assessment_completed: z.boolean(),
  manager_assessment_completed: z.boolean(),
  overall_rating: z.number().optional(),
  performance_summary: z.string().optional(),
  achievements: z.string().optional(),
  development_areas: z.string().optional(),
  goals_next_period: z.string().optional(),
  salary_recommendation: z.enum(['no_change', 'increase', 'bonus', 'promotion']).optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'approved']),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const GoalsResponseSchema = z.array(GoalSchema)
export const FeedbackResponseSchema = z.array(FeedbackSchema)
export const AppraisalsResponseSchema = z.array(AppraisalSchema)

export type Goal = z.infer<typeof GoalSchema>
export type CreateGoal = z.infer<typeof CreateGoalSchema>
export type Feedback = z.infer<typeof FeedbackSchema>
export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>
export type Appraisal = z.infer<typeof AppraisalSchema>
