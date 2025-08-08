'use client'

import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore } from '@/lib/auth'
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
import { GraduationCap, BookOpen, Award, Plus, Search, Calendar } from 'lucide-react'
import { 
  useTrainingPrograms, 
  useTrainingRequests, 
  useEmployeeSkills, 
  useEmployeeCertifications 
} from '@/hooks/useTraining'
import { useState } from 'react'

export default function EmployeeTrainingPage() {
  const { t } = useLocale()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: programs } = useTrainingPrograms()
  const { data: requests } = useTrainingRequests({ employee_id: user?.id })
  const { data: skills } = useEmployeeSkills(user?.id || '')
  const { data: certifications } = useEmployeeCertifications(user?.id || '')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training & Development</h1>
            <p className="text-muted-foreground">
              Explore training opportunities and track your progress
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Trainings
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests?.filter(r => r.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Skills Acquired
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {skills?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Certifications
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {certifications?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Programs</TabsTrigger>
            <TabsTrigger value="my-trainings">My Trainings</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Training Programs</CardTitle>
                <CardDescription>
                  Browse and enroll in available training programs
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
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {programs?.map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.title_en}</CardTitle>
                        <Badge variant="outline">{program.type}</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Location: {program.location || 'Online'}
                          </div>
                          <Button className="w-full mt-4">
                            Request Enrollment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-trainings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Training Requests</CardTitle>
                <CardDescription>
                  Track your training requests and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Requested Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.program_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.request_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'approved' ? 'secondary' : 'outline'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={request.status === 'completed' ? 100 : 
                                     request.status === 'approved' ? 50 : 0} 
                              className="w-16" 
                            />
                            <span className="text-sm text-muted-foreground">
                              {request.status === 'completed' ? '100%' : 
                               request.status === 'approved' ? '50%' : '0%'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at || '').toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Skills</CardTitle>
                <CardDescription>
                  Track and manage your professional skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {skills?.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <h3 className="font-medium">{skill.skill_name}</h3>
                          <Badge variant="secondary">{skill.skill_level}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <Button variant="ghost" className="w-full h-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Skill
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Certifications</CardTitle>
                <CardDescription>
                  View and manage your professional certifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications?.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{cert.certificate_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Issued by {cert.issuer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(cert.issue_date).toLocaleDateString()}
                              {cert.expiry_date && ` - ${new Date(cert.expiry_date).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {cert.verified && (
                              <Badge variant="default">Verified</Badge>
                            )}
                            <Award className="h-5 w-5 text-yellow-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
