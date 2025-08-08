'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, DollarSign, FileText, MapPin, Phone, Mail, User, Plus, Download } from 'lucide-react'
import { useEmployee } from '@/hooks/useEmployees'
import { useLeaveBalances } from '@/hooks/useLeaves'
import { usePayslips } from '@/hooks/usePayroll'
import Link from 'next/link'

const quickActions = [
  {
    title: 'Request Leave',
    description: 'Submit a new leave request',
    icon: Calendar,
    href: '/employee/leaves',
    color: 'text-blue-600',
  },
  {
    title: 'Clock In/Out',
    description: 'Record your attendance',
    icon: Clock,
    href: '/employee/attendance',
    color: 'text-green-600',
  },
  {
    title: 'View Payslip',
    description: 'Download latest payslip',
    icon: DollarSign,
    href: '/employee/payroll',
    color: 'text-purple-600',
  },
  {
    title: 'Request Document',
    description: 'Request official documents',
    icon: FileText,
    href: '/employee/documents',
    color: 'text-orange-600',
  },
]

export default function EmployeeDashboard() {
  const { t } = useLocale()
  const { user } = useAuthStore()

  const { data: profile } = useEmployee(user?.id || '')
  const { data: leaveBalances } = useLeaveBalances({ 
    employee_id: user?.id || '', 
    year: new Date().getFullYear() 
  })
  const { data: payslips } = usePayslips({ employee_id: user?.id })

  const recentPayslip = payslips?.[0] // Get the most recent payslip
  const totalLeaveBalance = leaveBalances?.reduce((sum, balance) => sum + balance.remaining_balance, 0) || 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('dashboard.welcome')}, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Here's your personal dashboard overview
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{profile?.job_title || 'Employee'}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user?.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {profile?.mobile_number || 'Not provided'}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    ID: {profile?.id?.slice(-6) || 'N/A'}
                  </div>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/employee/profile">
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalLeaveBalance} days
              </div>
              <p className="text-xs text-muted-foreground">
                Total remaining
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${recentPayslip?.net_pay?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Net salary
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95.2%</div>
              <p className="text-xs text-muted-foreground">
                This month's rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>
              Frequently used actions for your convenience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Annual Leave Request</p>
                    <p className="text-sm text-muted-foreground">Dec 25-30, 2024</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Salary Certificate</p>
                    <p className="text-sm text-muted-foreground">Requested 2 days ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Address Update</p>
                    <p className="text-sm text-muted-foreground">Requested 1 week ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Team Meeting</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Performance Review</p>
                    <p className="text-sm text-muted-foreground">Next week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Training Session</p>
                    <p className="text-sm text-muted-foreground">Jan 15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
