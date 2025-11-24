import { NextResponse, NextRequest } from "next/server";
import {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes
} from "@/constants/routes";

// Note: Middleware handler...!
export async function middleware(req: NextRequest) {
    // Get authentication tokens from cookies
    const authToken = req.cookies.get('AuthToken')?.value;
    const userAuthenticated = req.cookies.get('UserAuthenticated')?.value;

    // Check if user is authenticated (both cookies must exist)
    const isAuthenticated = Boolean(authToken && userAuthenticated);

    const { pathname } = req.nextUrl;

    // Check if current path is an authenticated route (including dynamic routes)
    const isAuthenticatedRoute = authenticatedRoutes.some(route => {
        if (route === '/edit') {
            // Handle dynamic edit routes like /edit/[uid]
            return pathname.startsWith('/edit/');
        }
        return pathname === route;
    }) || pathname === '/'; // Root is also protected

    // Check if current path is an unauthenticated route
    const isUnauthenticatedRoute = unAuthenticatedRoutes.some(route => pathname === route);

    // Note: Redirect unauthenticated user trying to access protected route...!
    if (!isAuthenticated && isAuthenticatedRoute) {
        console.log('Redirecting to login - unauthenticated access to protected route');
        return NextResponse.redirect(new URL(routes.login, req.url));
    }

    // Note: Redirect authenticated user trying to access login page...!
    if (isAuthenticated && isUnauthenticatedRoute) {
        console.log('Redirecting to dashboard - authenticated user accessing login');
        return NextResponse.redirect(new URL(routes.putAwayOrder, req.url));
    }

    // Note: Redirect root to dashboard if authenticated, otherwise to login
    if (pathname === '/') {
        if (isAuthenticated) {
            console.log('Redirecting to dashboard from root');
            return NextResponse.redirect(new URL(routes.putAwayOrder, req.url));
        } else {
            console.log('Redirecting to login from root');
            return NextResponse.redirect(new URL(routes.login, req.url));
        }
    }

    return NextResponse.next();
} export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)'
    ],
};
