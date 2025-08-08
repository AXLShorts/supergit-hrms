'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/components/locale-provider'
import { useAuthStore, isAdmin } from '@/lib/auth'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Users, Clock, Calendar, DollarSign, Target, GraduationCap, UserPlus, Shield, BarChart3, Settings, User, LogOut, ChevronDown, Languages, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const adminNavItems = [
  {
    title: 'nav.dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'nav.employees',
    url: '/admin/employees',
    icon: Users,
  },
  {
    title: 'nav.recruitment',
    url: '/admin/recruitment',
    icon: UserPlus,
  },
  {
    title: 'nav.attendance',
    url: '/admin/attendance',
    icon: Clock,
  },
  {
    title: 'nav.leaves',
    url: '/admin/leaves',
    icon: Calendar,
  },
  {
    title: 'nav.payroll',
    url: '/admin/payroll',
    icon: DollarSign,
  },
  {
    title: 'nav.performance',
    url: '/admin/performance',
    icon: Target,
  },
  {
    title: 'nav.training',
    url: '/admin/training',
    icon: GraduationCap,
  },
  {
    title: 'nav.compliance',
    url: '/admin/compliance',
    icon: Shield,
  },
  {
    title: 'nav.reports',
    url: '/admin/reporting',
    icon: BarChart3,
  },
]

const employeeNavItems = [
  {
    title: 'nav.dashboard',
    url: '/employee',
    icon: LayoutDashboard,
  },
  {
    title: 'nav.attendance',
    url: '/employee/attendance',
    icon: Clock,
  },
  {
    title: 'nav.leaves',
    url: '/employee/leaves',
    icon: Calendar,
  },
  {
    title: 'nav.payroll',
    url: '/employee/payroll',
    icon: DollarSign,
  },
  {
    title: 'nav.performance',
    url: '/employee/performance',
    icon: Target,
  },
  {
    title: 'nav.training',
    url: '/employee/training',
    icon: GraduationCap,
  },
  {
    title: 'Documents',
    url: '/employee/documents',
    icon: Shield,
  },
]

function AppSidebar() {
  const { t, locale, setLocale } = useLocale()
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const logout = useLogout()
  const pathname = usePathname()

  const navItems = isAdmin(user) ? adminNavItems : employeeNavItems

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">HRMS</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isAdmin(user) ? 'Admin Panel' : 'Employee Portal'}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.dashboard')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                >
                  <Languages className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'العربية' : 'English'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
