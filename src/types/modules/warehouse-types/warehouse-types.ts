// Note: All WareHouse related types are defined here...!

export type AccessWareHouseDataType = {
    whsCode: string;
    allow: boolean;
    receiver: boolean;
};

export interface WareHouseDataType {
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

export interface WareHouseDataObj {
    userId: string,
    normalWarehouseCodes: string[],
    receiverWarehouseCodes: string[]
};