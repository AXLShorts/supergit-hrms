import api from '@/lib/api'
import { 
  JobRequisition, 
  Vacancy, 
  Application, 
  Interview,
  JobRequisitionsResponseSchema,
  VacanciesResponseSchema,
  ApplicationsResponseSchema,
  InterviewsResponseSchema
} from '@/types/recruitment'

export class RecruitmentService {
  static async getJobRequisitions(): Promise<JobRequisition[]> {
    const response = await api.get('/recruitment/requisitions')
    return JobRequisitionsResponseSchema.parse(response.data)
  }

  static async createJobRequisition(data: Partial<JobRequisition>): Promise<JobRequisition> {
    const response = await api.post('/recruitment/requisitions', data)
    return response.data
  }

  static async updateJobRequisition(id: string, data: Partial<JobRequisition>): Promise<JobRequisition> {
    const response = await api.put(`/recruitment/requisitions/${id}`, data)
    return response.data
  }

  static async approveJobRequisition(id: string): Promise<void> {
    await api.post(`/recruitment/requisitions/${id}/approve`)
  }

  static async getVacancies(): Promise<Vacancy[]> {
    const response = await api.get('/recruitment/vacancies')
    return VacanciesResponseSchema.parse(response.data)
  }

  static async createVacancy(data: Partial<Vacancy>): Promise<Vacancy> {
    const response = await api.post('/recruitment/vacancies', data)
    return response.data
  }

  static async getApplications(params?: { vacancy_id?: string }): Promise<Application[]> {
    const response = await api.get('/recruitment/applications', { params })
    return ApplicationsResponseSchema.parse(response.data)
  }

  static async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const response = await api.put(`/recruitment/applications/${id}/status`, { status })
    return response.data
  }

  static async getInterviews(): Promise<Interview[]> {
    const response = await api.get('/recruitment/interviews')
    return InterviewsResponseSchema.parse(response.data)
  }

  static async scheduleInterview(data: Partial<Interview>): Promise<Interview> {
    const response = await api.post('/recruitment/interviews', data)
    return response.data
  }

  static async updateInterviewFeedback(id: string, data: {
    feedback: string
    rating: number
    recommendation: string
  }): Promise<Interview> {
    const response = await api.put(`/recruitment/interviews/${id}/feedback`, data)
    return response.data
  }
}
