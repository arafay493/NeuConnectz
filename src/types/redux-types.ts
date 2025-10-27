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

export interface ProductionOrderDataType {
    absoluteEntry: number,
    documentNumber: number,
    itemNo: string,
    originNo: number,
    plannedDate: string,
    productDescription: string,
    productionOrderStatus: string,
    project: string,
    quantity: number,
    remainingQuantity: number,
    uom: string,
    warehouse: string,
    createdDate: string,
}

export interface IssuesForProductionDataType {
    baseQuantity: number,
    plannedQuantity: number,
    postedDate: string,
    id: string,
    wareHouseCode: string,
    itemCode: string,
    itemName: string,
    documentType: string,
    documentAbsoluteEntry: number,
    quantity: number,
    documentNumber: number,
    sapStatus: string, issueDetails: {
        issueForProductionId: any,
        makeReady: number,
        qtyApproved: number,
        machineCount: number,
        sheetCount: number,
        section: any,
        qtyRejected: number,
        productionTime: any,
        unProductionTime: any,
        problem: any,
        workShift: any,
    }
}

export interface RecieptFromProductionDataType {
    id: string,
    wareHouseCode: string,
    itemCode: string,
    documentType: string,
    documentStatus: any,
    documentAbsoluteEntry: number,
    quantity: number,
    documentNumber: number,
    sapStatus: string,
    itemName: string,
    postedDate: string,
}

export interface ProductionOrderLinesDataType {
    documentAbsoluteEntry: number,
    lineNumber: number,
    itemNo: string,
    productDescription: string,
    productionOrderIssueType: string,
    warehouse: string,
    remainingQuantity: number,
    baseQuantity: number,
    plannedQuantity: number,
    issuedQuantity: number,
    stageID: number,
    stageName: string,
    uomName: string,
}

export interface SAPStateType {
    listAll_ITR_IT_TRS: Array<IT_TR_ITR_Props>;
    list_GRNS_Data: Array<GRN_Props>;
    list_Pending_GRNS_Data: Array<GRN_Props>;
    list_Integrated_GRNS_Data: Array<GRN_Props>;
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
    productionOrdersList: Array<ProductionOrderDataType>;
    productionOrdersCount: number;

    issuesForProductionList: Array<IssuesForProductionDataType>;
    issuesForProductionCount: number;

    recieptFromProductionList: Array<RecieptFromProductionDataType>;
    recieptFromProductionCount: number;

    listOfProductionOrderLines: Array<ProductionOrderLinesDataType>;
    productionOrderLinesCount: number;
    productionOrdersDocumentStates: {
        productionNumber: number,
        inventoryTransferRequests: number,
        inventoryTransfers: number,
        transferReceipts: number,
        issuances: number,
        receivings: number
    } | null;
    listAgainstPo: {

    } | null;
    totalRecordsAgainstPo: number
};

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
    quantity: number
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
    totalRolesCount: number,
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
        receivedQuantity: number,
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
        receiptFromProductionStatistics: {
            totalReceiptFromProductionIntegrated: string | number,
            totalReceiptFromProductionPending: string | number
        },
        issueForProductionStatistics: {
            totalIssueForProductionIntegrated: string | number,
            totalIssueForProductionPending: string | number
        },
        goodIssueStatistics: {
            totalGoodIssueIntegrated: string | number,
            totalGoodIssuePending: string | number
        },
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
    userITRCountList: {
        userName: string;
        itrCount: number;
    }[];
    dailyITRTransferKPIs: {
        period: string,
        totalRequests: number,
        dayOfWeek: string
    }[];
    userRequestsPerPeriod: {
        period: string,
        createdBy: string,
        userName: string
        userRequests: number,
    }[];
    ITRQuantity: {
        period: string,
        itemName: string,
        uniqueItems: number,
        quantity: number
    }[];
    ITRRequestsToWarehouse: {
        period: string,
        toWarehouseCode: string,
        warehouseName: string,
        totalRequests: number
    }[];
    ITRRequestsFromWarehouse: {
        period: string,
        fromWarehouseCode: string,
        warehouseName: string,
        totalRequests: number
    }[];
    ITRAvgCloseTime: {
        period: string,
        avgCloseHours: number
        unit: string
    }[];
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

export interface UnRecognizedITs {
    // itemCode: string;
    // itemName: string;
    // quantity: number;
}

export interface UnRecognizedTRs {
    // itemCode: string;
    // itemName: string;
    // quantity: number;
}

export interface ItemCodes {
    
}


export interface ItTrStateProps {
    inventoryTransferItems: Array<InventoryTransferItems>;
    transferReceiptItems: Array<TransferReceiptItems>;
    unReconciledITs: Array<UnRecognizedITs>
    unReconciledITsCount: number;
    unReconciledTRs: Array<UnRecognizedTRs>
    unReconciledTRsCount: number;
    itemCodes: Array<ItemCodes>
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
}
export interface GenerateBarcodeProps {
    id: string;
    status: string;
    qty: number;
    createdDate: string;
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


export interface GenerateListGoodsIssue {
    docNum: number,
    whsCode: string,
    itemCode: string,
    itemName: string,
    binCode: string,
    quantity: number,
    resource: string,
    uoM: string,
    barCode: string,
    postedDate: string,
}

export interface GoodsIssueListStateProps {
    listGoodIssue: Array<GenerateListGoodsIssue> | null;
    totalCount: number;
}