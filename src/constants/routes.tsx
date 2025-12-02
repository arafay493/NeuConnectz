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
    IconLayoutDashboardFilled,
    IconBarcode,
    IconChecklist,
    IconPlant,
    IconStack3,
    IconTruckDelivery,
    IconTruckReturn,
    IconSortAscendingShapes,
    IconShieldLock,
    IconBuildings,
    IconBuildingCog
} from "@tabler/icons-react";
import { Routes, DrawerRoute } from "@/types/route-types";
import { customStyles } from "@/styles/custom-theme";

// Note: Unauthenticated routes...!
const unAuthenticatedRoutes: String[] = ["/login"];

// Note: Authenticated routes...!
const authenticatedRoutes: String[] = [
    "/putaway-order",
    "/picking-order",
    // "/dashboard",
    // "/stock-movement",
    // "/reconciliation",
    // "/item-movement",
    // "/inventory-transfer",
    // "/it-tr-difference",
    // "/it-posted-documents",
    // "/tr-posted-documents",
    "/users-list",
    // "/assign-group",
    "/assign-plants",
    "/assign-warehouse",
    "/add-user",
    "/column-access-control",
    "/configuration",
    // "/integration-monitor",
    // "/edit",
    // "/grn-movement",
    // "/generate-barcode",
    // "/production-order",
    // "/goods-issue",
    // "/stock-transfer-order",
    "/assign-movement-type",
];

const initialRoute: string = "/putaway-order"

const settingsInitialRoute: string = "/users-list"

// Note: Defining all routes...!
const routes: Routes = {
    root: "/",
    login: "/login",
    // dashboard: "/dashboard",
    // stockMovement: "/stock-movement",
    // reconciliation: "/reconciliation",
    // itemMovement: "/item-movement",
    // inventoryTransfer: "/inventory-transfer",
    // itTrDifference: "/it-tr-difference",
    // itPostedDocuments: "/it-posted-documents",
    // trPostedDocuments: "/tr-posted-documents",
    usersList: "/users-list",
    assignGroup: "/assign-group",
    assignWareHouse: "/assign-warehouse",
    assignPlants: "/assign-plants",
    addUser: "/add-user",
    configuration: "/configuration",
    columnAccessControl: "/column-access-control",
    // integrationMonitor: "/integration-monitor",
    editUser: (uid: string) => `/edit/${uid}`,
    // grnMovement: "/grn-movement",
    // generateBarcode: "/generate-barcode",
    // productionOrder: "/production-order",
    // goodsIssue: "/goods-issue",
    // stockTransferOrder: "/stock-transfer-order",
    putAwayOrder: "/putaway-order",
    pickingOrder: "/picking-order",
    assignMovementType: "/assign-movement-type",
};

// Note: Defining drawer routes...!
const drawerRoutes: DrawerRoute[] = [
    // {
    //     icon: <IconLayoutDashboardFilled fill="currentColor" color='currentColor' size={24} />,
    //     label: "Dashboard",
    //     route: routes.dashboard,
    // },
    // {
    //     icon: <IconStack3Filled fill="currentColor" color='currentColor' size={24} />,
    //     label: "Stock Movement",
    //     route: routes.stockMovement,
    // },
    // {
    //     icon: <IconFileInvoiceFilled fill="currentColor" color='currentColor' size={24} />,
    //     label: "Goods Receipt Note",
    //     route: routes.grnMovement
    // },
    // {
    //     icon: <IconChecklist color='currentColor' size={24} />,
    //     label: "Production",
    //     route: routes.productionOrder
    // },
    // {
    //     icon: <IconChecklist color='currentColor' size={24} />,
    //     label: "Goods Issue",
    //     route: routes.goodsIssue
    // },
    // {
    //     icon: <IconStack3 color='currentColor' size={24} />,
    //     label: "Stock Transfer Order",
    //     route: routes.stockTransferOrder
    // },
    {
        icon: <IconTruckDelivery color='currentColor' size={24} />,
        label: "Putaway Order",
        route: routes.putAwayOrder
    },
    {
        icon: <IconTruckReturn color='currentColor' size={24} />,
        label: "Picking Order",
        route: routes.pickingOrder
    },
    // {
    //     icon: <IconPresentationAnalyticsFilled fill="currentColor" color='currentColor' size={24} />,
    //     label: "Integration Monitor",
    //     route: routes.integrationMonitor
    // },
    // {
    //     icon: <IconTextScan2 fill="currentColor" color='currentColor' size={24} />,
    //     label: "Reconciliation",
    //     route: routes.reconciliation,
    // },
    {
        icon: <IconUsersGroup color='currentColor' size={24} />,
        label: "Users List",
        route: routes.usersList,
    },
    // {
    //     icon: <IconUsersGroup color='currentColor' size={24} />,
    //     label: "Assign Group",
    //     route: routes.assignGroup,
    // },
    {
        icon: <IconBuildingCog color='currentColor' size={24} />,
        label: "Assign Plants",
        route: routes.assignPlants,
    },
    {
        icon: <IconBuildingWarehouse color='currentColor' size={24} />,
        label: "Assign Warehouse",
        route: routes.assignWareHouse,
    },

    {
        icon: <IconSortAscendingShapes color='currentColor' size={24} />,
        label: "Assign Movement Type",
        route: routes.assignMovementType
    },
    // {
    //     icon: <IconShieldLock color='currentColor' size={24} />,
    //     label: "Column Access Control",
    //     route: routes.columnAccessControl
    // },
    // {
    //     icon: <IconSettingsCog color='currentColor' size={24} />,
    //     label: "Configuration",
    //     route: routes.configuration
    // },
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
    // {
    //     icon: <IconBarcode color='currentColor' size={24} />,
    //     label: "Generate Barcode",
    //     route: routes.generateBarcode
    // }
];

export {
    unAuthenticatedRoutes,
    authenticatedRoutes,
    routes,
    drawerRoutes,
    initialRoute,
    settingsInitialRoute
};