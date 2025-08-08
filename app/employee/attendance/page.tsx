'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/sidebar'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore } from '@/lib/auth'
import { Button } from '@/components/ui/button'
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
import { useAttendanceLogs, useClockIn, useClockOut, useTodayAttendance } from '@/hooks/useAttendance'
import { useToast } from '@/hooks/use-toast'
import { Clock, MapPin, Calendar, Timer, CheckCircle, AlertCircle } from 'lucide-react'

export default function EmployeeAttendancePage() {
  const { t } = useLocale()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [location, setLocation] = useState<string>('')

  const { data: attendanceLogs, isLoading } = useAttendanceLogs({ employee_id: user?.id })
  const { data: todayAttendance } = useTodayAttendance(user?.id || '')
  const clockInMutation = useClockIn()
  const clockOutMutation = useClockOut()

  const handleClockIn = () => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
      })
    }
    
    clockInMutation.mutate({
      employee_id: user?.id || '',
      method: 'App',
      location: location || 'Unknown',
    }, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: 'Successfully clocked in',
        })
      },
      onError: () => {
        toast({
          title: t('common.error'),
          description: 'Failed to clock in',
          variant: 'destructive',
        })
      },
    })
  }

  const handleClockOut = () => {
    clockOutMutation.mutate({
      employee_id: user?.id || '',
      method: 'App',
      location: location || 'Unknown',
    }, {
      onSuccess: () => {
        toast({
          title: t('common.success'),
          description: 'Successfully clocked out',
        })
      },
      onError: () => {
        toast({
          title: t('common.error'),
          description: 'Failed to clock out',
          variant: 'destructive',
        })
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>
      case 'partial':
        return <Badge variant="secondary">Partial</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A'
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const calculateHours = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return 'N/A'
    const start = new Date(clockIn)
    const end = new Date(clockOut)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return `${hours.toFixed(1)}h`
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
              {t('attendance.title')}
            </h1>
            <p className="text-muted-foreground">
              Track your attendance and working hours
            </p>
          </div>
        </div>

        {/* Clock In/Out Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Today's Attendance
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clock In:</span>
                  <span className="text-lg font-bold">
                    {todayAttendance?.clock_in ? formatTime(todayAttendance.clock_in) : 'Not clocked in'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clock Out:</span>
                  <span className="text-lg font-bold">
                    {todayAttendance?.clock_out ? formatTime(todayAttendance.clock_out) : 'Not clocked out'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hours Worked:</span>
                  <span className="text-lg font-bold">
                    {todayAttendance ? calculateHours(todayAttendance.clock_in || '', todayAttendance.clock_out || '') : '0h'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {!todayAttendance?.clock_in ? (
                  <Button
                    onClick={handleClockIn}
                    disabled={clockInMutation.isPending}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {clockInMutation.isPending ? 'Clocking In...' : t('attendance.clockIn')}
                  </Button>
                ) : !todayAttendance?.clock_out ? (
                  <Button
                    onClick={handleClockOut}
                    disabled={clockOutMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {clockOutMutation.isPending ? 'Clocking Out...' : t('attendance.clockOut')}
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                    <p className="text-green-800 font-medium">Day completed!</p>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  Location tracking enabled
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Timer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">176h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overtime</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('attendance.myAttendance')}</CardTitle>
            <CardDescription>
              Your recent attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceLogs?.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {new Date(log.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{formatTime(log.clock_in || '')}</TableCell>
                      <TableCell>{formatTime(log.clock_out || '')}</TableCell>
                      <TableCell>{calculateHours(log.clock_in || '', log.clock_out || '')}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))}
                  {(!attendanceLogs || attendanceLogs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
