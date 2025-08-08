import api from '@/lib/api'
import { 
  Goal, 
  Feedback, 
  Appraisal,
  CreateGoal,
  CreateFeedback,
  GoalsResponseSchema,
  FeedbackResponseSchema,
  AppraisalsResponseSchema,
  GoalSchema,
  FeedbackSchema
} from '@/types/performance'

export class PerformanceService {
  static async getGoals(params?: { employee_id?: string }): Promise<Goal[]> {
    const response = await api.get('/performance/goals', { params })
    return GoalsResponseSchema.parse(response.data)
  }

  static async createGoal(data: CreateGoal): Promise<Goal> {
    const response = await api.post('/performance/goals', data)
    return GoalSchema.parse(response.data)
  }

  static async updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
    const response = await api.put(`/performance/goals/${id}`, data)
    return GoalSchema.parse(response.data)
  }

  static async getFeedback(params?: { employee_id?: string }): Promise<Feedback[]> {
    const response = await api.get('/performance/feedback', { params })
    return FeedbackResponseSchema.parse(response.data)
  }

  static async createFeedback(data: CreateFeedback): Promise<Feedback> {
    const response = await api.post('/performance/feedback', data)
    return FeedbackSchema.parse(response.data)
  }

  static async getAppraisals(params?: { employee_id?: string }): Promise<Appraisal[]> {
    const response = await api.get('/performance/appraisals', { params })
    return AppraisalsResponseSchema.parse(response.data)
  }
}
