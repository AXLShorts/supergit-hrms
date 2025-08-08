import { z } from 'zod'

export const EmployeeSchema = z.object({
  id: z.string(),
  employee_number: z.string(),
  first_name_en: z.string(),
  last_name_en: z.string(),
  first_name_ar: z.string().optional(),
  last_name_ar: z.string().optional(),
  email: z.string().email(),
  mobile_number: z.string(),
  national_id: z.string(),
  passport_number: z.string().optional(),
  date_of_birth: z.string(),
  gender: z.enum(['Male', 'Female']),
  nationality: z.string(),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  job_title: z.string(),
  department_id: z.string(),
  manager_id: z.string().optional(),
  employment_status: z.enum(['Active', 'Inactive', 'Terminated']),
  employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern']),
  join_date: z.string(),
  probation_end_date: z.string().optional(),
  contract_end_date: z.string().optional(),
  basic_salary: z.number(),
  housing_allowance: z.number().optional(),
  transport_allowance: z.number().optional(),
  other_allowances: z.number().optional(),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  iban: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const CreateEmployeeSchema = EmployeeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

export const EmployeeDocumentSchema = z.object({
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
})

export const EmployeesResponseSchema = z.array(EmployeeSchema)

export type Employee = z.infer<typeof EmployeeSchema>
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>
export type EmployeeDocument = z.infer<typeof EmployeeDocumentSchema>
