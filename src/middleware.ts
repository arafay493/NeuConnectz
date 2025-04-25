/***** Application middleware functionality to handle session or protected routes *****/

import { NextResponse, NextRequest } from "next/server";
import {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes
} from "@/constants/routes";

// Note: Middleware handler...!
const middleware = (req: NextRequest) => {

    const isUserLoggedIn: boolean = Boolean(req.cookies.get('UserAuthenticated')?.value);
    // console.log('User authentication flag: ', isUserLoggedIn);

    const { pathname } = req.nextUrl;
    // console.log('Current route: ', pathname);

    // Note: Redirect unauthenticated user trying to access protected route...!
    if (!isUserLoggedIn && authenticatedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(routes.login, req?.url));
    };

    // Note: Redirect authenticated user trying to access login page...!
    if (isUserLoggedIn && unAuthenticatedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(routes.root, req?.url));
    };

    return NextResponse.next();
};

export { middleware };