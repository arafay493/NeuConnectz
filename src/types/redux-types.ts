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
        users: Array<UserListProps>,
        totalCount: number,
    };
    listDepartmentData: {
        departments: Array<GenerateListDepartmentProps> | null;
        totalCount: number;
    }
    usersErrorState: string;
};

export interface UserListProps {
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
}

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
        groups: Array<ListAllGroupCodesProps>,
        totalCount: number
    };
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

export interface ListAllGroupCodesProps {
    id: string,
    groupCode: number | string,
    groupName: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
}

export interface SAPStateType {
    listAll_ITR_IT_TRS: Array<IT_TR_ITR_Props>;
    list_GRNS_Data: Array<GRN_Props>;
    list_Pending_GRNS_Data: Array<GRN_Props>;
    list_Integrated_GRNS_Data: Array<GRN_Props>;
    list_Item_Code_Data: Array<ItemDataProps> | null;
    list_item_Code_Data_By_Group_Id: ItemDataByHandlingUnitId | null;
    totalItemCodeCount: number;
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
    totalGRNS_DataCounts: number;
    listAll_ITR_IT_TRS_Count: number;
};

export interface ItemDataByHandlingUnitId {
    groupId: string;
    itemIds: string[];
}

export interface GRN_Props {
    createdBy: string;
    createdDate: string;
    docNum: string | number;
    docStatus: string;
    grnNumber: string | number;
    id: string;
    isActive: boolean;
    isArchived: boolean;
    itemCode: string;
    itemName: string;
    groupCode: string;
    groupName: string;
    sapStatus: string;
    updatedBy: string
    updatedDate: string
    userName: string;
    erpDocEntry: string | number;
    erpDocLine: string | number;
    vendorCode: string;
    vendorReference: string;
    whsCode: string;
}

export interface IT_TR_ITR_Props {
    id: string;
    type: string;
    docNumber: string | null;
    itemCode: string;
    fromWarehouse: string;
    toWarehouse: string;
    userName: string;
    erpDocEntry: string | null;
    erpLineID: string | null;
    updatedDate: string;
    status: string;
    docStatus: string;
}

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
        groupCode: string,
        groupName: string,
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
        groupCode: string,
        groupName: string,
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
        groupCode: string,
        groupName: string,
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
    itrErrorState: string,
    itrDataCount: number,
    itDataCount: number,
    trDataCount: number,
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


export interface GenerateBarcodeStateProps {
    generateBarcodeData: Array<GenerateBarcodeProps> | null;
    totalCount: number;
    loading: boolean
}
export interface GenerateBarcodeProps {
    id: string;
    status: string;
    qty: number;
    createdDate: string;
}

export interface ProductionOrderStateProps {
    data: Array<ListProductionOrder> | null;
    totalCount: number;
    loading: boolean
}

export interface ListProductionOrder {
    id?: string;
    groupId: string;
    qty: number;
    actualQty: number;
    itemCode: string;
    itemName: string;
    unitOfMeasurement: string;
    productionLine: string;
    warehouse: string;
    status?: string;
}

export interface ScanProductionOrderProps extends ListProductionOrder {
    stages: Stages[];
}

export interface AddHandlingUnit {
    name: string;
    stage: Stages;
}

export interface HandlingUnitStateProps {
    handlingUnit: Array<HandlingUnitProps> | null;
    handlingUnitByItemId: HandlingUnitProps | null;
    totalCount: number;
    loading: boolean;
}

export interface HandlingUnitProps {
    groupId: string;
    groupName: string;
    groupStages: Stages;
}

interface Stages {
    id?: string,
    name: string,
    level: number,
    description: string | null,
    capacity: number,
    subStages: Stages[]
}


export interface GenerateListDepartmentStateProps {
    listDepartmentData: Array<GenerateListDepartmentProps> | null;
    totalCount: number;
}

export interface GenerateListDepartmentProps {
    id: "20e3840b-36ef-4253-91ef-4fe456c7d394",
    departmentName: "string",
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean
}

export interface ItemDataProps {
    id: string;
    itemCode: string;
    itemName: string;
    ordrMulti: number | null;
    groupCode: number;
    ugpEntry: number;
    pUoMEntry: number | null;
    sUoMEntry: number | null;
    iUoMEntry: number | null;
    uomCode: string | null;
    baseQty: number | null;
    altQty: number | null;
    uoms: Array<UomProps>;
    createdBy: string | null;
    updatedBy: string | null;
    createdDate: string;
    updatedDate: string;
    isActive: boolean;
    isArchived: boolean;
}

export interface UomProps {
    uomEntry: number;
    uomCode: string;
    baseQty: number;
    altQty: number;
}