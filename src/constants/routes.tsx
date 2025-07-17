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
        icon: <IconTextScan2 fill="currentColor" color='currentColor' size={24} />,
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