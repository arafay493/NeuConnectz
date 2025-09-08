/***** Note: RolesReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RolesStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: RolesStateType = {
    listRoles: [],
    rolesErrorState: ""
};

const rolesSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_ROLES_DATA: (state) => {
            state.listRoles = [];
            state.rolesErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_LIST_ROLES: (state, action: PayloadAction<any>) => {
            state.rolesErrorState = ""
            state.listRoles = action?.payload;
        },

        CLEAR_ALL_ROLES_STATES: (state) => {
            state.listRoles = [];
            state.rolesErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_ROLES_DATA,
        FETCH_ALL_LIST_ROLES,
        CLEAR_ALL_ROLES_STATES
    } = rolesSlice.actions;
export default rolesSlice.reducer;