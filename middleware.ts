import { auth } from "@/lib/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth') || req.nextUrl.pathname.startsWith('/login')
    const isPublicRoute = req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/static') || req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/about')

    // Minimal protection strategy:
    // If not logged in and not on public route, redirect to login
    // if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    //     return Response.redirect(new URL('/login', req.nextUrl))
    // }

    // If logged in and on login page, redirect to dashboard or home
    if (isLoggedIn && req.nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
