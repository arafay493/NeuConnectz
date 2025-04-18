/***** Application middleware functionality to handle session or protected routes *****/

import { NextResponse, NextRequest } from "next/server";
import {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes
} from "@/constants/routes"

// Note: Middleware handler...!
const middleware = (req: NextRequest) => {

    const isUserLoggedIn: boolean = Boolean(req.cookies.get('UserAuthenticated')?.value);
    console.log('User authentication flag: ', isUserLoggedIn);

    const { pathname } = req.nextUrl;

    // Note: If user is not logged in...!
    if (!isUserLoggedIn) {
        if (authenticatedRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL(routes.login, req?.url));
        };
    };

    // Note: If user is logged in...!
    if (isUserLoggedIn) {
        if (unAuthenticatedRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL(routes.slash, req?.url));
        };
    };
};

export { middleware };