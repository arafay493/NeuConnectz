/***** Note: UserReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InventoryStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: InventoryStateType = {
    inventoryList: {
        data: [],
        totalCount: 0
    },
    ErrorState: ""
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_InVENTORY_DATA: (state) => {
            state.inventoryList = {
                data: [],
                totalCount: 0
            };
            state.ErrorState = "You are not authorized to access this data!";
        },

        // FETCH_ALL_USERS: (state, action: PayloadAction<any>) => {
        //     state.usersErrorState = ""
        //     state.usersList = action?.payload;
        // },

        FETCH_ALL_INVENTORY: (state, action: PayloadAction<any>) => {
            state.ErrorState = ""
            state.inventoryList = {
                data: action?.payload?.data,
                totalCount: action?.payload?.totalItems
            }
        },

        // FETCH_ALL_LIST_DEPARTMENTS: (state, action: PayloadAction<any>) => {
        //     state.listDepartmentData = action?.payload;
        // },

        CLEAR_ALL_INVENTORY_STATES: (state) => {
            state.inventoryList = {
                data: [],
                totalCount: 0
            };
            state.ErrorState = ""
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_InVENTORY_DATA,
        FETCH_ALL_INVENTORY,
        CLEAR_ALL_INVENTORY_STATES
    } = inventorySlice.actions;
export default inventorySlice.reducer;