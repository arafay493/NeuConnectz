// Note: Routes types are defined here...!

import { ReactNode } from "react";

export type Routes = {
    root: string;
    login: string;
    dashboard: string;
    stockMovement: string;
    reconciliation: string;
    // itemMovement: string;
    // inventoryTransfer: string;
    // itTrDifference: string;
    // itPostedDocuments: string;
    // trPostedDocuments: string;
    usersList: string;
    assignGroup: string;
    assignWareHouse: string;
    addUser: string;
    configuration: string;
    integrationMonitor: string;
    editUser: (uid: string) => string,
    grnMovement: string
    generateBarcode: string
};

export type DrawerRoute = {
    icon: ReactNode;
    label: string;
    route: string;
};