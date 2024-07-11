import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"  // By this we configure middleware from everywhere
import { getToken } from 'next-auth/jwt'

// in these routes middleware will run
export const config = {
    matcher: [
      '/sign-in',
      '/sign-up',
      '/',
      '/dashboard/:path*',
      '/verify/:path*',
      ]
  }

// This function will do all the work
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request});
    const url = request.nextUrl

    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
 
