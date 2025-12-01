// Note: Routes types are defined here...!

import { ReactNode } from "react";

export type Routes = {
    root: string;
    login: string;
    dashboard: string;
    stockMovement: string;
    reconciliation: string;
    usersList: string;
    assignGroup: string;
    assignWareHouse: string;
    addUser: string;
    configuration: string;
    integrationMonitor: string;
    editUser: (uid: string) => string;
    grnMovement: string;
    generateBarcode: string;
    productionOrder: string;
    addProductionOrder: string;
    handlingUnit: string;
    addHandlingUnit: string;
    scanProductionOrder: string;
    assignHandlingUnit: string;
    salesOrder: string;
    deliveryOrder: string;
    // Note: Defining types for New Master Routes...!
    master: string;
    customerMaster: string;
    productMaster: string;
    vehicleMaster: string;
    driverMaster: string;
    contractorMaster: string;
    addCustomerMaster: string;
    addProductMaster: string;
    addVehicleMaster: string;
    addDriverMaster: string;
    addContractorMaster: string;
};

export type DrawerRoute = {
    icon: ReactNode;
    label: string;
    route: string;
    children?: { label: string; route: string }[];
};