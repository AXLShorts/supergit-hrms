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
import { GraduationCap, BookOpen, Award, Users, Plus, Search, Filter, Calendar } from 'lucide-react'
import { useTrainingPrograms, useTrainingRequests } from '@/hooks/useTraining'
import { useState } from 'react'

export default function TrainingPage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: programs, isLoading: loadingPrograms } = useTrainingPrograms()
  const { data: requests, isLoading: loadingRequests } = useTrainingRequests()

  const stats = [
    {
      title: 'Active Programs',
      value: programs?.length || 0,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Training Requests',
      value: requests?.filter(r => r.status === 'pending').length || 0,
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      title: 'Enrolled Employees',
      value: requests?.filter(r => r.status === 'approved').length || 0,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Completed Trainings',
      value: requests?.filter(r => r.status === 'completed').length || 0,
      icon: Award,
      color: 'text-orange-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training & Development</h1>
            <p className="text-muted-foreground">
              Manage training programs and employee development
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Program
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
        <Tabs defaultValue="programs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="programs">Training Programs</TabsTrigger>
            <TabsTrigger value="requests">Training Requests</TabsTrigger>
            <TabsTrigger value="skills">Skills Management</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Programs</CardTitle>
                <CardDescription>
                  Manage available training programs and courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search programs..."
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
                      <TableHead>Program Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Max Participants</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs?.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">
                          {program.title_en}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{program.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{program.location || 'Online'}</TableCell>
                        <TableCell>{program.max_participants || 'Unlimited'}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Requests</CardTitle>
                <CardDescription>
                  Review and approve employee training requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.employee_id}</TableCell>
                        <TableCell>{request.program_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.request_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Approve
                            </Button>
                            <Button variant="outline" size="sm">
                              Reject
                            </Button>
                          </div>
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
