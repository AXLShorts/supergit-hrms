'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLeaveRequests, useCreateLeaveRequest, useLeaveBalances, useLeaveTypes } from '@/hooks/useLeaves'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateLeaveRequestSchema, CreateLeaveRequest } from '@/types/leave'
import { useToast } from '@/hooks/use-toast'
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function EmployeeLeavesPage() {
  const { t } = useLocale()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateLeaveRequest>({
    resolver: zodResolver(CreateLeaveRequestSchema),
    defaultValues: {
      employee_id: user?.id || '',
    },
  })

  const { data: leaveRequests, isLoading } = useLeaveRequests({ employee_id: user?.id })
  const { data: leaveTypes } = useLeaveTypes()
  const { data: leaveBalances } = useLeaveBalances({ 
    employee_id: user?.id || '', 
    year: new Date().getFullYear() 
  })
  const createLeaveRequestMutation = useCreateLeaveRequest()

  const onSubmit = (data: CreateLeaveRequest) => {
    createLeaveRequestMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: 'Leave request submitted successfully',
        })
        setIsDialogOpen(false)
        reset()
      },
      onError: () => {
        toast({
          title: t('common.error'),
          description: 'Failed to submit leave request',
          variant: 'destructive',
        })
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">{t('common.approved')}</Badge>
      case 'rejected':
        return <Badge variant="destructive">{t('common.rejected')}</Badge>
      case 'pending':
        return <Badge variant="secondary">{t('common.pending')}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
              {t('leaves.title')}
            </h1>
            <p className="text-muted-foreground">
              Manage your leave requests and view balances
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('leaves.requestLeave')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('leaves.requestLeave')}</DialogTitle>
                <DialogDescription>
                  Submit a new leave request. Make sure to check your leave balance.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leave_type_id">{t('leaves.leaveType')}</Label>
                  <Select onValueChange={(value) => setValue('leave_type_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name_en} ({type.annual_days} days available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.leave_type_id && (
                    <p className="text-sm text-red-600">{errors.leave_type_id.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">{t('leaves.startDate')}</Label>
                    <Input
                      id="start_date"
                      type="date"
                      {...register('start_date')}
                    />
                    {errors.start_date && (
                      <p className="text-sm text-red-600">{errors.start_date.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">{t('leaves.endDate')}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      {...register('end_date')}
                    />
                    {errors.end_date && (
                      <p className="text-sm text-red-600">{errors.end_date.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">{t('leaves.reason')}</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request"
                    {...register('reason')}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-600">{errors.reason.message}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={createLeaveRequestMutation.isPending}
                  >
                    {createLeaveRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {leaveBalances?.map((balance) => {
            const leaveType = leaveTypes?.find(t => t.id === balance.leave_type_id)
            return (
              <Card key={balance.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {leaveType?.name_en || 'Leave Type'}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{balance.remaining_balance}</div>
                  <p className="text-xs text-muted-foreground">days available</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Leave Requests History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('leaves.leaveHistory')}</CardTitle>
            <CardDescription>
              Your leave request history and current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests?.map((request) => {
                    const startDate = new Date(request.start_date)
                    const endDate = new Date(request.end_date)
                    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    const leaveType = leaveTypes?.find(t => t.id === request.leave_type_id)
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {leaveType?.name_en || request.leave_type_id}
                        </TableCell>
                        <TableCell>{startDate.toLocaleDateString()}</TableCell>
                        <TableCell>{endDate.toLocaleDateString()}</TableCell>
                        <TableCell>{days} days</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {(!leaveRequests || leaveRequests.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No leave requests found. Submit your first request above.
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
