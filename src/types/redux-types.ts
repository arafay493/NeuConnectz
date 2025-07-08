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
    usersErrorState: string
};

// Note: Ware House reducer state types...!
export interface WareHouseStateType {
    wareHousesList: {
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
        sapStatus: string,
        updatedBy: string
        updatedDate: string
        userName: string,
        vendorCode: string,
        vendorReference: string,
        whsCode: string,
    }[];
    sapErrorState: string;
    isSAPConfigExist: boolean
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
    }[]
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

// Note: Reconsiliation reducer state types...!
export interface ReconsiliationStateType {
    reconsiliationErrorState: string,
    inventoryTransferItems: {
        itemCode: string,
        itemName: string,
        quantity: 5
    }[],
    transferReceiptItems: {
        itemCode: string,
        itemName: string,
        quantity: 5
    }[],
}