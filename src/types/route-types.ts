// Note: Routes types are defined here...!

import { ReactNode } from "react";

export type Routes = {
    root: string;
    login: string;
    dashboard: string;
    inventoryTransferRequest: string;
    itemMovement: string;
    inventoryTransfer: string;
    itTrDifference: string;
    itPostedDocuments: string;
    trPostedDocuments: string;
    usersList: string;
    assignGroup: string;
    assignWareHouse: string,
    addUser: string
};

export type DrawerRoute = {
    icon: ReactNode;
    label: string;
    route: string;
};