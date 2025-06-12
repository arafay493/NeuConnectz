// Note: All SAP Feature related types are defined here...!

export interface AddSAPConfigDataType {
    erp: string,
    database: string,
    databaseUsername: string,
    databasePassword: string,
    url: string,
    systemUsername: string,
    systemPassword: string,
    inTransitWarehouse: string
};

export interface SAP_ITR_IT_TRS_DataType {
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
};