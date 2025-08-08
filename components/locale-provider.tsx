'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'en' | 'ar'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.clear': 'Clear',
    'common.select': 'Select',
    'common.all': 'All',
    'common.none': 'None',
    'common.other': 'Other',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.description': 'Description',
    'common.notes': 'Notes',
    'common.comments': 'Comments',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.pending': 'Pending',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.completed': 'Completed',
    'common.cancelled': 'Cancelled',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.overview': 'Overview',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.statistics': 'Statistics',

    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.welcome': 'Welcome to HRMS',
    'auth.loginSubtitle': 'Enter your credentials to access your account',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.employees': 'Employees',
    'nav.attendance': 'Attendance',
    'nav.leaves': 'Leaves',
    'nav.payroll': 'Payroll',
    'nav.performance': 'Performance',
    'nav.training': 'Training',
    'nav.recruitment': 'Recruitment',
    'nav.compliance': 'Compliance',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',

    // Employees
    'employees.title': 'Employees',
    'employees.addEmployee': 'Add Employee',
    'employees.employeeDetails': 'Employee Details',
    'employees.personalInfo': 'Personal Information',
    'employees.jobInfo': 'Job Information',
    'employees.contactInfo': 'Contact Information',
    'employees.emergencyContact': 'Emergency Contact',
    'employees.bankDetails': 'Bank Details',
    'employees.documents': 'Documents',

    // Attendance
    'attendance.title': 'Attendance',
    'attendance.clockIn': 'Clock In',
    'attendance.clockOut': 'Clock Out',
    'attendance.myAttendance': 'My Attendance',
    'attendance.attendanceReport': 'Attendance Report',
    'attendance.workingHours': 'Working Hours',
    'attendance.overtime': 'Overtime',

    // Leaves
    'leaves.title': 'Leaves',
    'leaves.requestLeave': 'Request Leave',
    'leaves.leaveHistory': 'Leave History',
    'leaves.leaveBalance': 'Leave Balance',
    'leaves.leaveType': 'Leave Type',
    'leaves.startDate': 'Start Date',
    'leaves.endDate': 'End Date',
    'leaves.reason': 'Reason',
    'leaves.approveLeave': 'Approve Leave',
    'leaves.rejectLeave': 'Reject Leave',

    // Payroll
    'payroll.title': 'Payroll',
    'payroll.payslip': 'Payslip',
    'payroll.salary': 'Salary',
    'payroll.allowances': 'Allowances',
    'payroll.deductions': 'Deductions',
    'payroll.netPay': 'Net Pay',
    'payroll.grossPay': 'Gross Pay',
    'payroll.taxDeductions': 'Tax Deductions',

    // Performance
    'performance.title': 'Performance',
    'performance.goals': 'Goals',
    'performance.feedback': 'Feedback',
    'performance.appraisal': 'Appraisal',
    'performance.kpi': 'KPI',
    'performance.rating': 'Rating',

    // Training
    'training.title': 'Training & Development',
    'training.programs': 'Training Programs',
    'training.requests': 'Training Requests',
    'training.skills': 'Skills',
    'training.certifications': 'Certifications',

    // Recruitment
    'recruitment.title': 'Recruitment',
    'recruitment.jobPostings': 'Job Postings',
    'recruitment.applications': 'Applications',
    'recruitment.interviews': 'Interviews',
    'recruitment.candidates': 'Candidates',

    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.security': 'Security',
    'settings.notifications': 'Notifications',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
  },
  ar: {
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.submit': 'إرسال',
    'common.reset': 'إعادة تعيين',
    'common.clear': 'مسح',
    'common.select': 'اختيار',
    'common.all': 'الكل',
    'common.none': 'لا شيء',
    'common.other': 'أخرى',
    'common.actions': 'الإجراءات',
    'common.status': 'الحالة',
    'common.date': 'التاريخ',
    'common.time': 'الوقت',
    'common.name': 'الاسم',
    'common.email': 'البريد الإلكتروني',
    'common.phone': 'الهاتف',
    'common.address': 'العنوان',
    'common.description': 'الوصف',
    'common.notes': 'ملاحظات',
    'common.comments': 'تعليقات',
    'common.active': 'نشط',
    'common.inactive': 'غير نشط',
    'common.pending': 'قيد الانتظار',
    'common.approved': 'موافق عليه',
    'common.rejected': 'مرفوض',
    'common.completed': 'مكتمل',
    'common.cancelled': 'ملغي',

    // Dashboard
    'dashboard.welcome': 'مرحباً',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.quickActions': 'الإجراءات السريعة',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.statistics': 'الإحصائيات',

    // Authentication
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.rememberMe': 'تذكرني',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signOut': 'تسجيل الخروج',
    'auth.welcome': 'مرحباً بك في نظام إدارة الموارد البشرية',
    'auth.loginSubtitle': 'أدخل بياناتك للوصول إلى حسابك',

    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.employees': 'الموظفون',
    'nav.attendance': 'الحضور',
    'nav.leaves': 'الإجازات',
    'nav.payroll': 'الرواتب',
    'nav.performance': 'الأداء',
    'nav.training': 'التدريب',
    'nav.recruitment': 'التوظيف',
    'nav.compliance': 'الامتثال',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',

    // Employees
    'employees.title': 'الموظفون',
    'employees.addEmployee': 'إضافة موظف',
    'employees.employeeDetails': 'تفاصيل الموظف',
    'employees.personalInfo': 'المعلومات الشخصية',
    'employees.jobInfo': 'معلومات الوظيفة',
    'employees.contactInfo': 'معلومات الاتصال',
    'employees.emergencyContact': 'جهة الاتصال في حالات الطوارئ',
    'employees.bankDetails': 'تفاصيل البنك',
    'employees.documents': 'المستندات',

    // Attendance
    'attendance.title': 'الحضور',
    'attendance.clockIn': 'تسجيل الحضور',
    'attendance.clockOut': 'تسجيل الانصراف',
    'attendance.myAttendance': 'حضوري',
    'attendance.attendanceReport': 'تقرير الحضور',
    'attendance.workingHours': 'ساعات العمل',
    'attendance.overtime': 'العمل الإضافي',

    // Leaves
    'leaves.title': 'الإجازات',
    'leaves.requestLeave': 'طلب إجازة',
    'leaves.leaveHistory': 'تاريخ الإجازات',
    'leaves.leaveBalance': 'رصيد الإجازات',
    'leaves.leaveType': 'نوع الإجازة',
    'leaves.startDate': 'تاريخ البداية',
    'leaves.endDate': 'تاريخ النهاية',
    'leaves.reason': 'السبب',
    'leaves.approveLeave': 'الموافقة على الإجازة',
    'leaves.rejectLeave': 'رفض الإجازة',

    // Payroll
    'payroll.title': 'الرواتب',
    'payroll.payslip': 'قسيمة الراتب',
    'payroll.salary': 'الراتب',
    'payroll.allowances': 'البدلات',
    'payroll.deductions': 'الخصومات',
    'payroll.netPay': 'صافي الراتب',
    'payroll.grossPay': 'إجمالي الراتب',
    'payroll.taxDeductions': 'خصومات الضرائب',

    // Performance
    'performance.title': 'الأداء',
    'performance.goals': 'الأهداف',
    'performance.feedback': 'التغذية الراجعة',
    'performance.appraisal': 'التقييم',
    'performance.kpi': 'مؤشرات الأداء الرئيسية',
    'performance.rating': 'التقييم',

    // Training
    'training.title': 'التدريب والتطوير',
    'training.programs': 'برامج التدريب',
    'training.requests': 'طلبات التدريب',
    'training.skills': 'المهارات',
    'training.certifications': 'الشهادات',

    // Recruitment
    'recruitment.title': 'التوظيف',
    'recruitment.jobPostings': 'الوظائف المعلنة',
    'recruitment.applications': 'الطلبات',
    'recruitment.interviews': 'المقابلات',
    'recruitment.candidates': 'المرشحون',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.general': 'عام',
    'settings.security': 'الأمان',
    'settings.notifications': 'الإشعارات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
  },
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // Load locale from localStorage or browser preference
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'ar') {
        setLocale('ar')
      }
    }
  }, [])

  useEffect(() => {
    // Save locale to localStorage
    localStorage.setItem('locale', locale)
    
    // Update document direction and language
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || key
  }

  const value: LocaleContextType = {
    locale,
    setLocale,
    t,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
