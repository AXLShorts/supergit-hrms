import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is accessing protected routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/employee')) {
    // In a real app, you would check for a valid JWT token
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Redirect root to appropriate dashboard based on role
  if (pathname === '/') {
    // In a real app, you would decode the JWT to get the role
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)',
  ],
}
