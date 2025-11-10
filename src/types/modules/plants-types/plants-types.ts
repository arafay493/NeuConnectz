export interface PlantCodeDataType {
    id: string,
    plantCode: string | number,
    plantName: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

export interface AssignPlantToUserDataType {
    userId: string,
    plantCodes: (string | number)[]
};