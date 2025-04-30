// Note: All User related types are defined here...!

export interface LoginUserDataType {
    email: string;
    password: string;
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