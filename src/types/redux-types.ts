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
};