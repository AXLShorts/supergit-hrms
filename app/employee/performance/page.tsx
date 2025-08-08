'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Target, TrendingUp, MessageSquare, Award, Calendar } from 'lucide-react'
import { useGoals, useFeedback, useAppraisals } from '@/hooks/usePerformance'

export default function EmployeePerformancePage() {
  const { t } = useLocale()
  const { user } = useAuthStore()
  
  const { data: goals } = useGoals({ employee_id: user?.id })
  const { data: feedback } = useFeedback({ employee_id: user?.id })
  const { data: appraisals } = useAppraisals({ employee_id: user?.id })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
            <p className="text-muted-foreground">
              Track your goals, view feedback, and monitor your performance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Goals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {goals?.filter(g => g.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Goals
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {goals?.filter(g => g.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Feedback Received
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedback?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Rating
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedback?.length ? 
                  (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 
                  'N/A'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="goals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="goals">My Goals</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Goals & KPIs</CardTitle>
                <CardDescription>
                  Track your progress towards your performance goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal Title</TableHead>
                      <TableHead>KPI Metric</TableHead>
                      <TableHead>Target</TableHead>
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
                          <TableCell>{goal.kpi_metric}</TableCell>
                          <TableCell>{goal.target_value}</TableCell>
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
                  View feedback received from managers and peers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback?.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{item.role}</Badge>
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
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              From: {item.reviewer_id}
                            </p>
                            <p className="text-sm">{item.feedback_text}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.created_at || '').toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appraisals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Appraisals</CardTitle>
                <CardDescription>
                  View your performance appraisal history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Overall Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appraisals?.map((appraisal) => (
                      <TableRow key={appraisal.id}>
                        <TableCell className="font-medium">
                          {appraisal.cycle_name}
                        </TableCell>
                        <TableCell>
                          {appraisal.overall_rating ? (
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < appraisal.overall_rating! ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                {appraisal.overall_rating}/5
                              </span>
                            </div>
                          ) : (
                            'Pending'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            appraisal.status === 'completed' ? 'default' :
                            appraisal.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {appraisal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(appraisal.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
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
