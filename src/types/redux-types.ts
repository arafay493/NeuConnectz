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
        status: string,
        erpDocEntry: string | null,
        erpLineID: string | null,
        isActive: boolean
    }[];
    sapErrorState: string
};