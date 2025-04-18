// Note: All autheenticated and non-authenticated routes are defined here...!

import { Routes } from "@/types/route-types";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: String[] = [
    "/",
    "/home",
    "/about"
];

// Note: Defining all routes...!
const routes : Routes = {
    slash: "/",
    login: "/login",
    home: "/home",
    about: "/about"
};

export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes
};