// Note: All redux types are defined here...!

// Note: Auth reducer state types...!
export interface AuthStateType {
    authenticatedUser: {
        name: string,
        email: string,
        userId: string,
        userType: string,
        token: string,
        refreshToken: string,
        roleAndActions: []
    } | null
};

// Note: User reducer state types...!
export interface UserStateType {
    usersList: {
        userId: string,
        userName: string,
        email: string,
        phone: string,
        department: string,
        role: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean
    }[];
    totalUsersCount: number;
    usersErrorState: string;
};



// Note: Ware House reducer state types...!
export interface WareHouseStateType {
    wareHousesList: {
        data: Array<WarehousesListData>
        totalCount: number
    };
    warehousesListByUserId: {
        id: string,
        whsCode: string,
        whsName: string,
        isReceiver: boolean,
        binActivat: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
        isArchived: boolean
    }[];
    warehouseErrorState: string
};

export interface WarehousesListData {
    id: string,
    whsCode: string,
    whsName: string,
    isReceiver: boolean,
    binActivat: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

// Note: Group reducer state types...!
export interface GroupStateType {
    ListAllGroupCodes: {
        id: string,
        groupCode: number | string,
        groupName: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
        isArchived: boolean
    }[];
    listGroupCodesByUserId: {
        id: string,
        groupCode: number | string,
        groupName: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
        isArchived: boolean
    }[];
    totalGroupCodesCount: number;
    GroupErrorState: string
};

export interface SAPStateType {
    listAll_ITR_IT_TRS: {
        id: string,
        type: string,
        docNumber: string | null,
        itemCode: string,
        fromWarehouse: string,
        toWarehouse: string,
        userName: string,
        erpDocEntry: string | null,
        erpLineID: string | null,
        updatedDate: string,
        status: string,
        docStatus: string
    }[];
    totalITR_IT_TRS_Counts: number
    list_GRNS_Data: {
        createdBy: string,
        createdDate: string,
        docNum: string | number,
        docStatus: string,
        grnNumber: string | number,
        id: string,
        isActive: boolean,
        isArchived: boolean,
        itemCode: string,
        itemName: string,
        sapStatus: string,
        updatedBy: string
        updatedDate: string
        userName: string,
        erpDocEntry: string | number,
        erpDocLine: string | number,
        vendorCode: string,
        vendorReference: string,
        whsCode: string,
    }[];
    sapErrorState: string;
    isSAPConfigExist: boolean,
    vendorCodeList: {
        cardCode: string,
        cardName: string,
        id: string,
    }[],
    sapStagingDataCounts: {
        warehouseTotal: number,
        groupCodeTotal: number,
        stockMasterTotal: number,
        stockBarcodeTotal: number,
        stockWarehouseTotal: number,
        binLocationTotal: number,
        vendorMasterTotal: number
    } | null;
    totalGRNS_DataCounts: number
};

export interface RolesStateType {
    listRoles: {
        createdBy: string,
        updatedBy: string,
        updatedDate: string,
        createdDate: string,
        isActive: boolean,
        id: string,
        name: string,
        tag: string
    }[];
    rolesErrorState: string
};

export interface ITRStateType {
    itrData: {
        id: string,
        docNum: string | number,
        docDate: string,
        fromWarehouseId: string,
        toWarehouseId: string,
        docStatus: string,
        itemCode: string,
        itemName: string,
        quantity: string | number,
        uom: string,
        openQuantity: string | number,
        erpDocEntry: string | number,
        erpObjectType: string,
        erpDocLine: string | number,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
        isArchived: boolean,
        sapStatus: string
    }[];
    itrCount: number;
    trData: {
        id: string,
        fromWareHouseCode: string,
        toWareHouseCode: string,
        itemCode: string,
        itemName: string,
        quantity: string | number,
        uom: string,
        barCode: string | number,
        binLocation: string | null,
        docStatus: string,
        erpDocEntry: string | number,
        erpObjectType: string | number,
        erpDocLine: string | number,
        sapStatus: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
        isArchived: boolean,
        docNum: string | number,
    }[],
    trCount: number;
    itData: {
        id: string,
        fromWarehouseId: string,
        toWarehouseId: string,
        itemCode: string,
        itemName: string,
        binCode: string,
        barCode: string,
        docStatus: string,
        receivedQuantity: string | number,
        erpDocEntry: string | number,
        erpObjectType: string | number,
        erpDocLine: string | number,
        sapStatus: string,
        inTransit: string,
        docNum: string | number,
        uniqueId: string,
        createdBy: string,
        updatedBy: string,
        createdDate: string,
        updatedDate: string,
        isActive: boolean,
    }[],
    itCount: number;
    itrErrorState: string
};

export interface ITR_DataType {
    id: string,
    docNum: string | number,
    docDate: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    docStatus: string,
    itemCode: string,
    itemName: string,
    quantity: string | number,
    uom: string,
    openQuantity: string | number,
    erpDocEntry: string | number,
    erpObjectType: string,
    erpDocLine: string | number,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean,
    sapStatus: string
};

export interface TR_DataType {
    id: string,
    fromWareHouseCode: string,
    toWareHouseCode: string,
    itemCode: string,
    itemName: string,
    quantity: string | number,
    uom: string,
    barCode: string | number,
    binLocation: string | null,
    docStatus: string,
    erpDocEntry: string | number,
    erpObjectType: string | number,
    erpDocLine: string | number,
    sapStatus: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean,
    docNum: string | number,
};

export interface IT_DataType {
    id: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    itemCode: string,
    itemName: string,
    binCode: string,
    barCode: string,
    docStatus: string,
    receivedQuantity: string | number,
    erpDocEntry: string | number,
    erpObjectType: string | number,
    erpDocLine: string | number,
    sapStatus: string,
    inTransit: string,
    docNum: string | number,
    itrDocNum: string | number,
    uniqueId: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
};

// Note: Dashboard reducer state types...!
export interface DashboardStateType {
    dashboardErrorState: string,
    dashboardAnalyticsData: {
        grnStatistics: {
            totalGrnIntegrated: string | number,
            totalGrnPending: string | number
        },
        lastIntegrationDates: {
            lastItrIntegrationDate: string,
            lastItIntegrationDate: string,
            lastTrIntegrationDate: string,
            lastGrnIntegrationDate: string
        },
        topCreatedItems: {
            count: string | number,
            itemCode: string
        }[],
        transferStatistics: {
            totalItIntegrated: number,
            totalItPending: number,
            totalItrIntegrated: number,
            totalItrPending: number,
            totalTrIntegrated: number,
            totalTrPending: number,
        }
    } | null;
}

// Note: Reconciliation Types
export interface InventoryTransferItems {
    itemCode: string;
    itemName: string;
    quantity: number;
}

export interface TransferReceiptItems {
    itemCode: string;
    itemName: string;
    quantity: number;
}


export interface ItTrStateProps {
    inventoryTransferItems: Array<InventoryTransferItems>;
    transferReceiptItems: Array<TransferReceiptItems>;
    reconciliationErrorState: string;
}

// Note: Type definition for Inventory Transfer data
export interface QuantityDifferenceData {
    itemCode: string;
    itemName: string;
    totalITQuantity: number;
    totalTRQuantity: number;
    quantityDifference: number;
    action: string;
}