import { z } from 'zod'

export const PayslipSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  month: z.string(),
  year: z.number(),
  basic_salary: z.number(),
  housing_allowance: z.number(),
  transport_allowance: z.number(),
  other_allowances: z.number(),
  overtime_amount: z.number(),
  gross_salary: z.number(),
  gosi_employee: z.number(),
  income_tax: z.number(),
  other_deductions: z.number(),
  total_deductions: z.number(),
  net_pay: z.number(),
  status: z.enum(['Draft', 'Processed', 'Paid']),
  processed_by: z.string().optional(),
  processed_at: z.string().optional(),
  created_at: z.string().optional(),
})

export const SalaryComponentSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  component_type: z.enum(['allowance', 'deduction']),
  component_name: z.string(),
  amount: z.number(),
  is_percentage: z.boolean(),
  is_taxable: z.boolean(),
  effective_from: z.string(),
  effective_to: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
})

export const SalaryStructureSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  basic_salary: z.number(),
  housing_allowance: z.number(),
  transport_allowance: z.number(),
  other_allowances: z.number(),
  effective_from: z.string(),
  effective_to: z.string().optional(),
  created_by: z.string(),
  created_at: z.string().optional(),
})

export const LoanSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  loan_type: z.string(),
  amount: z.number(),
  installments: z.number(),
  installment_amount: z.number(),
  remaining_amount: z.number(),
  start_date: z.string(),
  status: z.enum(['Active', 'Completed', 'Cancelled']),
  approved_by: z.string().optional(),
  created_at: z.string().optional(),
})

export const CreateLoanSchema = LoanSchema.omit({
  id: true,
  remaining_amount: true,
  status: true,
  approved_by: true,
  created_at: true,
})

export const PayslipsResponseSchema = z.array(PayslipSchema)
export const SalaryComponentsResponseSchema = z.array(SalaryComponentSchema)
export const SalaryStructuresResponseSchema = z.array(SalaryStructureSchema)
export const LoansResponseSchema = z.array(LoanSchema)

export type Payslip = z.infer<typeof PayslipSchema>
export type SalaryComponent = z.infer<typeof SalaryComponentSchema>
export type SalaryStructure = z.infer<typeof SalaryStructureSchema>
export type Loan = z.infer<typeof LoanSchema>
export type CreateLoan = z.infer<typeof CreateLoanSchema>

// Computed properties for payslip
export interface PayslipWithCalculations extends Payslip {
  allowances: number
  deductions: number
}
