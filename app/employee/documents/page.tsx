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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Download, Upload, Plus, Search, Calendar } from 'lucide-react'
import { useDocuments, useDocumentRequests, useCreateDocumentRequest } from '@/hooks/useDocuments'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateDocumentRequestSchema, CreateDocumentRequest } from '@/types/documents'

export default function EmployeeDocumentsPage() {
  const { t } = useLocale()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  
  const { data: documents } = useDocuments({ employee_id: user?.id })
  const { data: requests } = useDocumentRequests({ employee_id: user?.id })
  const createRequest = useCreateDocumentRequest()

  const form = useForm<CreateDocumentRequest>({
    resolver: zodResolver(CreateDocumentRequestSchema),
    defaultValues: {
      employee_id: user?.id || '',
    },
  })

  const onSubmit = async (data: CreateDocumentRequest) => {
    try {
      await createRequest.mutateAsync(data)
      setIsRequestDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error('Failed to create document request:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Access your documents and request new ones
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Request Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Document</DialogTitle>
                  <DialogDescription>
                    Request an official document from HR
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Document Type</label>
                    <Select onValueChange={(value) => form.setValue('document_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary_certificate">Salary Certificate</SelectItem>
                        <SelectItem value="employment_letter">Employment Letter</SelectItem>
                        <SelectItem value="experience_certificate">Experience Certificate</SelectItem>
                        <SelectItem value="no_objection_certificate">No Objection Certificate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Purpose</label>
                    <Textarea
                      placeholder="Please specify the purpose for this document..."
                      {...form.register('purpose')}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsRequestDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createRequest.isPending}>
                      {createRequest.isPending ? 'Requesting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                My Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests?.filter(r => r.status === 'pending').length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expiring Soon
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents?.filter(d => {
                  if (!d.expiry_date) return false
                  const expiryDate = new Date(d.expiry_date)
                  const thirtyDaysFromNow = new Date()
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                  return expiryDate <= thirtyDaysFromNow
                }).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="requests">Document Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>
                  Access and download your personal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents?.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          {document.document_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{document.document_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            document.status === 'active' ? 'default' :
                            document.status === 'expired' ? 'destructive' : 'secondary'
                          }>
                            {document.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {document.expiry_date 
                            ? new Date(document.expiry_date).toLocaleDateString()
                            : 'No expiry'
                          }
                        </TableCell>
                        <TableCell>
                          {new Date(document.created_at || '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
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
                <CardTitle>Document Requests</CardTitle>
                <CardDescription>
                  Track your document requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Completed Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.document_type.replace('_', ' ').toUpperCase()}
                        </TableCell>
                        <TableCell>{request.purpose}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.requested_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {request.completed_at 
                            ? new Date(request.completed_at).toLocaleDateString()
                            : '-'
                          }
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
