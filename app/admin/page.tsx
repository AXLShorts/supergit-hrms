'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, Clock, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

const statsCards = [
  {
    title: 'Total Employees',
    value: '1,234',
    change: '+12%',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'New Hires',
    value: '23',
    change: '+5%',
    icon: UserPlus,
    color: 'text-green-600',
  },
  {
    title: 'Attendance Rate',
    value: '94.5%',
    change: '+2.1%',
    icon: Clock,
    color: 'text-purple-600',
  },
  {
    title: 'Leave Requests',
    value: '45',
    change: '-8%',
    icon: Calendar,
    color: 'text-orange-600',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'leave_request',
    message: 'John Doe requested annual leave',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'employee_joined',
    message: 'Sarah Smith joined as Software Engineer',
    time: '4 hours ago',
    status: 'success',
  },
  {
    id: 3,
    type: 'document_expired',
    message: 'Ahmed Ali\'s Iqama expires in 30 days',
    time: '6 hours ago',
    status: 'warning',
  },
  {
    id: 4,
    type: 'payroll_processed',
    message: 'Monthly payroll processed successfully',
    time: '1 day ago',
    status: 'success',
  },
]

export default function AdminDashboard() {
  const { t } = useLocale()

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employees')
      return response.data
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('dashboard.welcome')}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your organization today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('employees.addEmployee')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{card.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activity */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {activity.status === 'warning' && (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      {activity.status === 'pending' && (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Badge
                      variant={
                        activity.status === 'success'
                          ? 'default'
                          : activity.status === 'warning'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              <CardDescription>
                Frequently used actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Employee
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Review Leave Requests
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payroll
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
