// Note: All autheenticated and non-authenticated routes are defined here...!

import {
    IconListCheck,
    IconStack3Filled,
    IconFileInvoiceFilled,
    IconTextScan2,
    IconUsersGroup,
    IconBuildingWarehouse,
    IconSettingsCog,
    IconPresentationFilled,
    IconPresentationAnalyticsFilled,
    IconLayoutDashboardFilled
} from "@tabler/icons-react";
import { Routes, DrawerRoute } from "@/types/route-types";
import { customStyles } from "@/styles/custom-theme";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: String[] = [
    "/",
    "/dashboard",
    "/stock-movement",
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
        icon: <IconLayoutDashboardFilled fill="currentColor" color='currentColor' size={24} />,
        label: "dashboard",
        route: routes.dashboard,
    },
    {
        icon: <IconStack3Filled fill="currentColor" color='currentColor' size={24} />,
        label: "stock movement",
        route: routes.stockMovement,
    },
    {
        icon: <IconFileInvoiceFilled fill="currentColor" color='currentColor' size={24} />,
        label: "GRN movement",
        route: routes.grnMovement
    },
    {
        icon: <IconUsersGroup color='currentColor' size={24} />,
        label: "users list",
        route: routes.usersList,
    },
    {
        icon: <IconUsersGroup color='currentColor' size={24} />,
        label: "assign group",
        route: routes.assignGroup,
    },
    {
        icon: <IconBuildingWarehouse color='currentColor' size={24} />,
        label: "assign warehouse",
        route: routes.assignWareHouse,
    },
    {
        icon: <IconSettingsCog color='currentColor' size={24} />,
        label: "configuration",
        route: routes.configuration
    },
    {
        icon: <IconPresentationAnalyticsFilled fill="currentColor" color='currentColor' size={24} />,
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