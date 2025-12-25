import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes that don't need auth checks
    const isAuthRoute = pathname.startsWith('/api/auth') || pathname.startsWith('/login')
    const isPublicRoute = pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/assets') ||
        pathname === '/' ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/events') ||
        pathname.startsWith('/clubs') ||
        pathname.startsWith('/leadership')

    // If logged in and on login page, check if needs onboarding
    if (isLoggedIn && pathname === '/login') {
        // New users (students without system_id) should go to onboarding
        const user = req.auth?.user
        if (user?.role === 'student' && !user?.system_id) {
            return NextResponse.redirect(new URL('/onboarding', req.nextUrl))
        }
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    // If logged in as student without system_id and NOT on onboarding page
    if (isLoggedIn && req.auth?.user?.role === 'student' && !req.auth?.user?.system_id) {
        // Allow onboarding and api routes
        if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/onboarding', req.nextUrl))
        }
    }

    // If on onboarding page but already completed, redirect to dashboard
    if (isLoggedIn && pathname === '/onboarding' && req.auth?.user?.system_id) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    // If trying to access onboarding without being logged in
    if (!isLoggedIn && pathname === '/onboarding') {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)", "/api/user/:path*"],
}
