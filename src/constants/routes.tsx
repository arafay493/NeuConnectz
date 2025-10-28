// Note: All autheenticated and non-authenticated routes are defined here...!

import {
    IconStack3Filled,
    IconFileInvoiceFilled,
    IconTextScan2,
    IconUsersGroup,
    IconBuildingWarehouse,
    IconSettingsCog,
    IconPresentationAnalyticsFilled,
    IconLayoutDashboardFilled,
    IconBarcode,
    IconContainer,
    IconBox,
    IconPackage
} from "@tabler/icons-react";
import { Routes, DrawerRoute } from "@/types/route-types";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: string[] = [
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
    "/grn-movement",
    "/generate-barcode",
    "/production-order",
    "/production-order/add-order",
    "/handling-unit",
    "/handling-unit/add-unit",
    "/production-order/scan/:dynamicPath",
    "/assign-handling-unit",
    // Note: Defining New Master Routes...!
    "/master",
    "/master/customer-data",
    "/master/product-data",
    "/master/vehicle-data",
    "/master/driver-data",
    "/master/add-customer",
    "/master/add-product",
    "/master/add-vehicle",
    "/master/add-driver"
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
    generateBarcode: "/generate-barcode",
    productionOrder: "/production-order",
    addProductionOrder: "/production-order/add-order",
    handlingUnit: "/handling-unit",
    addHandlingUnit: "/handling-unit/add-unit",
    scanProductionOrder: "/production-order/scan/:dynamicPath",
    assignHandlingUnit: "/assign-handling-unit",
    // Note: Master Parent Route...!
    master: "/master",
    // Note: Nested Master Pages
    customerMaster: "/master/customer-data",
    productMaster: "/master/product-data",
    vehicleMaster: "/master/vehicle-data",
    driverMaster: "/master/driver-data",
    addCustomerMaster: "/master/add-customer",
    addProductMaster: "/master/add-product",
    addVehicleMaster: "/master/add-vehicle",
    addDriverMaster: "/master/add-driver"
};

// Note: Defining drawer routes...!
const drawerRoutes: DrawerRoute[] = [
    {
        icon: <IconLayoutDashboardFilled fill="currentColor" color='currentColor' size={24} />,
        label: "Dashboard",
        route: routes.dashboard,
    },
    {
        icon: <IconStack3Filled fill="currentColor" color='currentColor' size={24} />,
        label: "Stock Movement",
        route: routes.stockMovement,
    },
    {
        icon: <IconFileInvoiceFilled fill="currentColor" color='currentColor' size={24} />,
        label: "GRN Movement",
        route: routes.grnMovement
    },
    {
        icon: <IconTextScan2 fill="currentColor" color='currentColor' size={24} />,
        label: "Reconciliation",
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
        label: "Users List",
        route: routes.usersList,
    },
    {
        icon: <IconUsersGroup color='currentColor' size={24} />,
        label: "Assign Group",
        route: routes.assignGroup,
    },
    {
        icon: <IconBuildingWarehouse color='currentColor' size={24} />,
        label: "Assign Warehouse",
        route: routes.assignWareHouse,
    },
    {
        icon: <IconSettingsCog color='currentColor' size={24} />,
        label: "Configuration",
        route: routes.configuration
    },
    {
        icon: <IconPresentationAnalyticsFilled fill="currentColor" color='currentColor' size={24} />,
        label: "Integration Monitor",
        route: routes.integrationMonitor
    },
    {
        icon: <IconBarcode color='currentColor' size={24} />,
        label: "Generate Barcode",
        route: routes.generateBarcode
    },
    {
        icon: <IconBox color='currentColor' size={24} />,
        label: "Handling Unit",
        route: routes.handlingUnit
    },
    {
        icon: <IconPackage color='currentColor' size={24} />,
        label: "Assign Handling Unit",
        route: routes.assignHandlingUnit
    },
    {
        icon: <IconContainer color='currentColor' size={24} />,
        label: "Production Order",
        route: routes.productionOrder
    },

    {
        icon: <IconUsersGroup size={24} />,
        label: "Master",
        route: routes.master,
        children: [ // Note: Add nested tabs
            { label: "Customer Master", route: routes.customerMaster },
            { label: "Product Master", route: routes.productMaster },
            { label: "Vehicle Master", route: routes.vehicleMaster },
            { label: "Driver Master", route: routes.driverMaster },
        ]
    }
];

function routeExists(path: string, routes: string[]) {
    return routes.some(route => {
        // Convert `:param` into regex match
        const regex = new RegExp("^" + route.replace(/:[^/]+/g, "[^/]+") + "$");
        return regex.test(path);
    });
}

export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes,
    routeExists,
    drawerRoutes
};