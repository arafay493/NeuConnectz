// Note: All constant user data is defined here...!

import { UserRole, UserDepartment } from "@/types/modules/user-types/user-types";

// Note: User roles...!
const userRoles: UserRole[] = [
    "SuperAdmin",
    "WareHouseUser",
    "Receiver"
];

const userDepartments: UserDepartment[] = [
    "Inventory Control",
    "Logistics",
    "Dispatch",
    "WareHouse"
];

export { userRoles, userDepartments };