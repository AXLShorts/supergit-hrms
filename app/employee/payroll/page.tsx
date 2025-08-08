'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { usePayslips, useSalaryStructures } from '@/hooks/usePayroll'
import { DollarSign, Download, Calendar, TrendingUp, TrendingDown, FileText } from 'lucide-react'

export default function EmployeePayrollPage() {
  const { t } = useLocale()
  const { user } = useAuthStore()

  const { data: payslips, isLoading } = usePayslips({ employee_id: user?.id })
  const { data: salaryStructures } = useSalaryStructures({ employee_id: user?.id })

  const currentPayslip = payslips?.[0] // Most recent payslip
  const salaryStructure = salaryStructures?.[0] // Current salary structure

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('payroll.title')}
            </h1>
            <p className="text-muted-foreground">
              View your salary details and download payslips
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Latest Payslip
          </Button>
        </div>

        {/* Current Month Summary */}
        {currentPayslip && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Current Month - {new Date(currentPayslip.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Basic Salary:</span>
                    <span className="text-lg font-bold">{formatCurrency(currentPayslip.basic_salary)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Allowances:</span>
                    <span className="text-lg font-bold text-green-600">
                      +{formatCurrency(currentPayslip.allowances)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Deductions:</span>
                    <span className="text-lg font-bold text-red-600">
                      -{formatCurrency(currentPayslip.deductions)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Net Pay:</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(currentPayslip.net_pay)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Housing Allowance:</span>
                      <span>{formatCurrency(salaryStructure?.housing_allowance || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transport Allowance:</span>
                      <span>{formatCurrency(salaryStructure?.transport_allowance || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GOSI Contribution:</span>
                      <span className="text-red-600">-{formatCurrency(currentPayslip.basic_salary * 0.1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax:</span>
                      <span className="text-red-600">-{formatCurrency(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Trends */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payslips?.length ? formatCurrency(
                  payslips.reduce((sum, p) => sum + p.net_pay, 0) / payslips.length
                ) : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on last 6 months
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">YTD Earnings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payslips?.length ? formatCurrency(
                  payslips.reduce((sum, p) => sum + p.net_pay, 0)
                ) : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Year to date total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Increment</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+5.2%</div>
              <p className="text-xs text-muted-foreground">
                January 2024
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payslip History */}
        <Card>
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>
              Your salary history and downloadable payslips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslips?.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">
                        {new Date(payslip.month).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>{formatCurrency(payslip.basic_salary)}</TableCell>
                      <TableCell className="text-green-600">
                        +{formatCurrency(payslip.allowances)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{formatCurrency(payslip.deductions)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(payslip.net_pay)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!payslips || payslips.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payslips available yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
