// Note: All Group related types are defined here...!

export interface GroupCodeDataType {
    id: string,
    groupCode: string | number,
    groupName: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

export interface AssignGrouptoUserDataType {
    userId: string,
    groupCodes: (string | number)[]
};