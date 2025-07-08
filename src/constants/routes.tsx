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
    "/item-movement",
    "/inventory-transfer",
    "/it-tr-difference",
    "/it-posted-documents",
    "/tr-posted-documents",
    "/users-list",
    "/assign-group",
    "/assign-warehouse",
    "/add-user",
    "/configuration",
    "/integration-monitor",
    "/edit-user",
    "/history",
    "/handling-units",
    "/handling-units/add",
    "/production-order",
    "/production-order/add",
    "/production-order/scan/:docNumber"
];

// Note: Defining all routes...!
const routes: Routes = {
    root: "/",
    login: "/login",
    dashboard: "/dashboard",
    stockMovement: "/stock-movement",
    reconciliation: "/reconciliation",
    itemMovement: "/item-movement",
    inventoryTransfer: "/inventory-transfer",
    itTrDifference: "/it-tr-difference",
    itPostedDocuments: "/it-posted-documents",
    trPostedDocuments: "/tr-posted-documents",
    usersList: "/users-list",
    assignGroup: "/assign-group",
    assignWareHouse: "/assign-warehouse",
    addUser: "/add-user",
    configuration: "/configuration",
    integrationMonitor: "/integration-monitor",
    editUser: "/edit-user",
    history: "/history",
    handlingUnits: "/handling-units",
    addHandlingUnit: "/handling-units/add",
    productionOrder: "/production-order",
    addProductionOrder: "/production-order/add",
    scanProductionOrder: "/production-order/scan/:dynamicPath",
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
        label: "reconciliation",
        route: routes.reconciliation,
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
    {
        icon: <IconListCheck size={20} />,
        label: "history",
        route: routes.history
    },
    {
        icon: <IconListCheck size={20} />,
        label: "handling units",
        route: routes.handlingUnits
    },
    {
        icon: <IconListCheck size={20} />,
        label: "production order",
        route: routes.productionOrder
    },
];

const authenticatedRoutesCheck = (path: string): boolean => {
    const routeValues = Object.values(routes);

    return routeValues.some((route) => {
        // Convert route pattern (like /production-order/scan/:dynamicPath)
        // to a regular expression (like ^/production-order/scan/[^/]+$)
        if (route.includes(":")) {
            const regex = new RegExp(
                "^" +
                route
                    .split("/")
                    .map((segment) =>
                        segment.startsWith(":") ? "[^/]+" : segment
                    )
                    .join("/") +
                "$"
            );
            return regex.test(path);
        }

        // Exact match for static routes
        return route === path;
    });
};


export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    authenticatedRoutesCheck,
    routes,
    drawerRoutes
};