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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus, Search, Filter, MoreHorizontal, Calendar, Users, FileText, Clock } from 'lucide-react'
import { useJobRequisitions, useVacancies, useApplications, useInterviews } from '@/hooks/useRecruitment'
import { useState } from 'react'

export default function RecruitmentPage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: requisitions, isLoading: loadingRequisitions } = useJobRequisitions()
  const { data: vacancies, isLoading: loadingVacancies } = useVacancies()
  const { data: applications, isLoading: loadingApplications } = useApplications()
  const { data: interviews, isLoading: loadingInterviews } = useInterviews()

  const stats = [
    {
      title: 'Open Positions',
      value: vacancies?.filter(v => v.status === 'active').length || 0,
      icon: UserPlus,
      color: 'text-blue-600',
    },
    {
      title: 'Applications',
      value: applications?.length || 0,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Interviews Scheduled',
      value: interviews?.filter(i => i.status === 'scheduled').length || 0,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Reviews',
      value: applications?.filter(a => a.status === 'under_review').length || 0,
      icon: Clock,
      color: 'text-orange-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
            <p className="text-muted-foreground">
              Manage job postings, applications, and hiring process
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  New Job Requisition
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Job Requisition</DialogTitle>
                  <DialogDescription>
                    Create a new job requisition to start the hiring process
                  </DialogDescription>
                </DialogHeader>
                {/* Job requisition form would go here */}
              </DialogContent>
            </Dialog>
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
        <Tabs defaultValue="requisitions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requisitions">Job Requisitions</TabsTrigger>
            <TabsTrigger value="vacancies">Active Vacancies</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="requisitions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Requisitions</CardTitle>
                <CardDescription>
                  Manage job requisition requests from departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requisitions..."
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
                      <TableHead>Job Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Vacancies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisitions?.map((requisition) => (
                      <TableRow key={requisition.id}>
                        <TableCell className="font-medium">
                          {requisition.job_title}
                        </TableCell>
                        <TableCell>{requisition.department_id}</TableCell>
                        <TableCell>{requisition.number_of_vacancies}</TableCell>
                        <TableCell>
                          <Badge variant={
                            requisition.status === 'approved' ? 'default' :
                            requisition.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {requisition.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{requisition.requested_by}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>
                  Review and manage candidate applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications?.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.full_name}
                        </TableCell>
                        <TableCell>{application.vacancy_id}</TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            application.status === 'hired' ? 'default' :
                            application.status === 'interview' ? 'secondary' : 'outline'
                          }>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
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
