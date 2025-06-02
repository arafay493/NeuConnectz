// Note: All User related types are defined here...!

export interface LoginUserDataType {
    email: string;
    password: string;
};

export interface CreateUserDataType {
    userName: string,
    phone: string,
    email: string;
    password: string;
    department: string,
    role: string
};

export interface UserType {
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
};

export interface RefreshTokenType {
    accessToken: string,
    refreshToken: string
};

export type UserRole = "SuperAdmin" | "WareHouseUser" | "Receiver";
export type UserDepartment = "Inventory Control" | "Logistics" | "Dispatch" | "WareHouse";

export interface ActivationStatusType {
    userId: string;
    isActive: boolean;
};