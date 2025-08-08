import api from '@/lib/api'
import { 
  Employee, 
  CreateEmployee, 
  UpdateEmployee, 
  EmployeeDocument,
  EmployeeSchema,
  EmployeesResponseSchema 
} from '@/types/employee'

export class EmployeeService {
  static async getEmployees(): Promise<Employee[]> {
    const response = await api.get('/employees')
    return EmployeesResponseSchema.parse(response.data)
  }

  static async getEmployee(id: string): Promise<Employee> {
    const response = await api.get(`/employees/${id}`)
    return EmployeeSchema.parse(response.data)
  }

  static async createEmployee(data: CreateEmployee): Promise<Employee> {
    const response = await api.post('/employees', data)
    return EmployeeSchema.parse(response.data)
  }

  static async updateEmployee(id: string, data: UpdateEmployee): Promise<Employee> {
    const response = await api.put(`/employees/${id}`, data)
    return EmployeeSchema.parse(response.data)
  }

  static async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/employees/${id}`)
  }

  static async getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
    const response = await api.get(`/employees/${employeeId}/documents`)
    return response.data
  }

  static async addEmployeeDocument(employeeId: string, document: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
    const response = await api.post(`/employees/${employeeId}/documents`, document)
    return response.data
  }

  static async getEmployeeIdentities(employeeId: string): Promise<any[]> {
    const response = await api.get(`/employees/${employeeId}/identities`)
    return response.data
  }
}
