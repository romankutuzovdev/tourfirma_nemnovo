import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}

export function middleware(_: NextRequest) {
  return NextResponse.next()
}
