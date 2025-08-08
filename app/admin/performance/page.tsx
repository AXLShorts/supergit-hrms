'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, MessageSquare, Award, Plus, Search, Filter } from 'lucide-react'
import { useGoals, useFeedback, useAppraisals } from '@/hooks/usePerformance'
import { useState } from 'react'

export default function PerformancePage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: goals, isLoading: loadingGoals } = useGoals()
  const { data: feedback, isLoading: loadingFeedback } = useFeedback()
  const { data: appraisals, isLoading: loadingAppraisals } = useAppraisals()

  const stats = [
    {
      title: 'Active Goals',
      value: goals?.filter(g => g.status === 'active').length || 0,
      icon: Target,
      color: 'text-blue-600',
    },
    {
      title: 'Completed Goals',
      value: goals?.filter(g => g.status === 'completed').length || 0,
      icon: Award,
      color: 'text-green-600',
    },
    {
      title: 'Feedback Given',
      value: feedback?.length || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
    },
    {
      title: 'Appraisals Due',
      value: appraisals?.filter(a => a.status === 'pending').length || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
            <p className="text-muted-foreground">
              Track goals, provide feedback, and manage employee performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Set Goal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="goals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="goals">Goals & KPIs</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employee Goals</CardTitle>
                <CardDescription>
                  Track and manage employee goals and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search goals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal Title</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>KPI Metric</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals?.map((goal) => {
                      const progress = goal.achieved_value && goal.target_value 
                        ? (goal.achieved_value / goal.target_value) * 100 
                        : 0
                      
                      return (
                        <TableRow key={goal.id}>
                          <TableCell className="font-medium">
                            {goal.title}
                          </TableCell>
                          <TableCell>{goal.employee_id}</TableCell>
                          <TableCell>{goal.kpi_metric}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={progress} className="w-16" />
                              <span className="text-sm text-muted-foreground">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              goal.status === 'completed' ? 'default' :
                              goal.status === 'active' ? 'secondary' : 'outline'
                            }>
                              {goal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(goal.period_end).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Feedback</CardTitle>
                <CardDescription>
                  View and manage performance feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.employee_id}</TableCell>
                        <TableCell>{item.reviewer_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {item.rating}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(item.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
