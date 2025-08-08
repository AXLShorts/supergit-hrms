import api from '@/lib/api'
import { 
  TrainingProgram, 
  TrainingRequest, 
  Skill, 
  Certification,
  CreateTrainingRequest,
  CreateSkill,
  TrainingProgramsResponseSchema,
  TrainingRequestsResponseSchema,
  SkillsResponseSchema,
  CertificationsResponseSchema,
  TrainingProgramSchema,
  TrainingRequestSchema
} from '@/types/training'

export class TrainingService {
  static async getTrainingPrograms(): Promise<TrainingProgram[]> {
    const response = await api.get('/training/programs')
    return TrainingProgramsResponseSchema.parse(response.data)
  }

  static async getTrainingRequests(params?: { employee_id?: string }): Promise<TrainingRequest[]> {
    const response = await api.get('/training/requests', { params })
    return TrainingRequestsResponseSchema.parse(response.data)
  }

  static async createTrainingRequest(data: CreateTrainingRequest): Promise<TrainingRequest> {
    const response = await api.post('/training/requests', data)
    return TrainingRequestSchema.parse(response.data)
  }

  static async getEmployeeSkills(employeeId: string): Promise<Skill[]> {
    const response = await api.get(`/training/skills?employee_id=${employeeId}`)
    return SkillsResponseSchema.parse(response.data)
  }

  static async addEmployeeSkill(data: CreateSkill): Promise<Skill> {
    const response = await api.post('/training/skills', data)
    return response.data
  }

  static async getEmployeeCertifications(employeeId: string): Promise<Certification[]> {
    const response = await api.get(`/training/certifications?employee_id=${employeeId}`)
    return CertificationsResponseSchema.parse(response.data)
  }
}
