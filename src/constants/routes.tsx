// Note: All autheenticated and non-authenticated routes are defined here...!

import { IconListCheck } from "@tabler/icons-react";
import { Routes, DrawerRoute } from "@/types/route-types";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: String[] = [
    "/",
    "/dashboard",
    "/inventory-transfer-request",
    "/item-movement",
    "/inventory-transfer",
    "/it-tr-difference",
    "/it-posted-documents",
    "/tr-posted-documents",
    "/users-list",
    "/configuration",
];

// Note: Defining all routes...!
const routes: Routes = {
    root: "/",
    login: "/login",
    dashboard: "/dashboard",
    inventoryTransferRequest: "/inventory-transfer-request",
    itemMovement: "/item-movement",
    inventoryTransfer: "/inventory-transfer",
    itTrDifference: "/it-tr-difference",
    itPostedDocuments: "/it-posted-documents",
    trPostedDocuments: "/tr-posted-documents",
    usersList: "/users-list",
    configuration: "/configuration",
};

// Note: Defining drawer routes...!
const drawerRoutes: DrawerRoute[] = [
    {
        icon: <IconListCheck size={20} />,
        label: "Dashboard",
        route: routes.dashboard,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "ITR",
        route: routes.inventoryTransferRequest,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "item movement",
        route: routes.itemMovement,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "inventory transfer",
        route: routes.inventoryTransfer,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "IT - TR difference",
        route: routes.itTrDifference,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "IT posted documents",
        route: routes.itPostedDocuments,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "TR posted documents",
        route: routes.trPostedDocuments,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "Users List",
        route: routes.usersList,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "configuration",
        route: routes.configuration,
    },
];


export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes,
    drawerRoutes
};