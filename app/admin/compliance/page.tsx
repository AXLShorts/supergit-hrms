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
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Search, Filter } from 'lucide-react'
import { useComplianceChecks, useAuditLogs } from '@/hooks/useCompliance'
import { useState } from 'react'

export default function CompliancePage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: checks, isLoading: loadingChecks } = useComplianceChecks()
  const { data: auditLogs, isLoading: loadingLogs } = useAuditLogs()

  const stats = [
    {
      title: 'Compliance Checks',
      value: checks?.length || 0,
      icon: Shield,
      color: 'text-blue-600',
    },
    {
      title: 'Overdue Items',
      value: checks?.filter(c => c.status === 'overdue').length || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Completed',
      value: checks?.filter(c => c.status === 'completed').length || 0,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending',
      value: checks?.filter(c => c.status === 'pending').length || 0,
      icon: Clock,
      color: 'text-orange-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor compliance requirements and audit trails
            </p>
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
        <Tabs defaultValue="checks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="checks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checks</CardTitle>
                <CardDescription>
                  Monitor employee compliance requirements and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search compliance checks..."
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
                      <TableHead>Employee</TableHead>
                      <TableHead>Check Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checks?.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>{check.employee_id}</TableCell>
                        <TableCell className="font-medium">
                          {check.check_type}
                        </TableCell>
                        <TableCell>
                          {new Date(check.due_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            check.status === 'completed' ? 'default' :
                            check.status === 'overdue' ? 'destructive' : 'secondary'
                          }>
                            {check.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {check.completed_date 
                            ? new Date(check.completed_date).toLocaleDateString()
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  System activity and user action logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.user_id}</TableCell>
                        <TableCell className="font-medium">
                          {log.action}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.resource_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.resource_id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.ip_address || '-'}</TableCell>
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
