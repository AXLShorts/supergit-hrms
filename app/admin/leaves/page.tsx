'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '@/hooks/useLeaves'
import { Search, Filter, MoreHorizontal, Check, X, Calendar, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LeavesPage() {
  const { t } = useLocale()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: leaveRequests, isLoading } = useLeaveRequests()
  const approveMutation = useApproveLeaveRequest()
  const rejectMutation = useRejectLeaveRequest()

  const filteredRequests = leaveRequests?.filter(request =>
    request.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleApprove = (requestId: string) => {
    approveMutation.mutate(requestId, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: 'Leave request approved successfully',
        })
      },
    })
  }

  const handleReject = (requestId: string) => {
    rejectMutation.mutate(requestId, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: 'Leave request rejected successfully',
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
              Manage employee leave requests and policies
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Leave Calendar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredRequests?.filter(r => r.status === 'Pending').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredRequests?.filter(r => r.status === 'Approved').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRequests?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejection Rate</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredRequests?.length 
                  ? Math.round((filteredRequests.filter(r => r.status === 'Rejected').length / filteredRequests.length) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Review and manage employee leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {t('common.filter')}
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request) => {
                    const startDate = new Date(request.start_date)
                    const endDate = new Date(request.end_date)
                    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32&query=employee`} />
                              <AvatarFallback>EMP</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Employee Name</div>
                              <div className="text-sm text-muted-foreground">
                                ID: {request.employee_id.slice(-4)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.leave_type_id}</TableCell>
                        <TableCell>{startDate.toLocaleDateString()}</TableCell>
                        <TableCell>{endDate.toLocaleDateString()}</TableCell>
                        <TableCell>{days} days</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {request.status === 'Pending' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(request.id)}
                                    className="text-green-600"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReject(request.id)}
                                    className="text-red-600"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
