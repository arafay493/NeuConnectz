// Note: All autheenticated and non-authenticated routes are defined here...!

import { IconListCheck } from "@tabler/icons-react";
import { Routes, DrawerRoute } from "@/types/route-types";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: String[] = [
    "/",
    "/dashboard",
    "/stock-movement",
    "/reconciliation",
    // "/item-movement",
    // "/inventory-transfer",
    // "/it-tr-difference",
    // "/it-posted-documents",
    // "/tr-posted-documents",
    "/users-list",
    "/assign-group",
    "/assign-warehouse",
    "/add-user",
    "/configuration",
    "/integration-monitor",
    "/edit",
    "/grn-movement"
];

// Note: Defining all routes...!
const routes: Routes = {
    root: "/",
    login: "/login",
    dashboard: "/dashboard",
    stockMovement: "/stock-movement",
    reconciliation: "/reconciliation",
    // itemMovement: "/item-movement",
    // inventoryTransfer: "/inventory-transfer",
    // itTrDifference: "/it-tr-difference",
    // itPostedDocuments: "/it-posted-documents",
    // trPostedDocuments: "/tr-posted-documents",
    usersList: "/users-list",
    assignGroup: "/assign-group",
    assignWareHouse: "/assign-warehouse",
    addUser: "/add-user",
    configuration: "/configuration",
    integrationMonitor: "/integration-monitor",
    editUser: (uid: string) => `/edit/${uid}`,
    grnMovement: "/grn-movement",
};

// Note: Defining drawer routes...!
const drawerRoutes: DrawerRoute[] = [
    {
        icon: <IconListCheck size={20} />,
        label: "dashboard",
        route: routes.dashboard,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "stock movement",
        route: routes.stockMovement,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "GRN movement",
        route: routes.grnMovement
    },
    {
        icon: <IconListCheck size={20} />,
        label: "reconciliation",
        route: routes.reconciliation,
    },
    // {
    //     icon: <IconListCheck size={20} />,
    //     label: "item movement",
    //     route: routes.itemMovement,
    // },
    // {
    //     icon: <IconListCheck size={20} />,
    //     label: "inventory transfer",
    //     route: routes.inventoryTransfer,
    // },
    // {
    //     icon: <IconListCheck size={20} />,
    //     label: "IT - TR difference",
    //     route: routes.itTrDifference,
    // },
    // {
    //     icon: <IconListCheck size={20} />,
    //     label: "IT posted documents",
    //     route: routes.itPostedDocuments,
    // },
    // {
    //     icon: <IconListCheck size={20} />,
    //     label: "TR posted documents",
    //     route: routes.trPostedDocuments,
    // },
    {
        icon: <IconListCheck size={20} />,
        label: "users list",
        route: routes.usersList,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "assign group",
        route: routes.assignGroup,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "assign warehouse",
        route: routes.assignWareHouse,
    },
    {
        icon: <IconListCheck size={20} />,
        label: "configuration",
        route: routes.configuration
    },
    {
        icon: <IconListCheck size={20} />,
        label: "integration monitor",
        route: routes.integrationMonitor
    },
];

export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes,
    drawerRoutes
};