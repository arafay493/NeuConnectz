/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlantsStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: any = {
    putaway_columns: {
        serialNumber: true,
        docNum: true,
        transferReceiptNumber: false,
        material: false,
        materialDescription: true,
        materialDocument: true,
        baseUOM: true,
        totalQuantity: true,
        movementType: true,
        purchaseOrder: true,
        supplierName: true,
        sourceStorageBin: true,
        confirmationStatus: true,
        createdOn: true,
        actions: true
    },
};

const columnBasedAccessControlSlice = createSlice({
    name: "columnBasedAccessControl",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA: (state) => {
            state.ListAllPlantsCodes = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_PLANTS_CODES: (state, action: PayloadAction<any>) => {
            state.PlantsErrorState = "";
            state.ListAllPlantsCodes = action?.payload;
        },

        FETCH_ALL_PLANTS_CODES_BY_USER: (state, action: PayloadAction<any>) => {
            state.PlantsErrorState = "";
            state.ListAllPlantsCodesByUser = action?.payload;
        },

        CLEAR_ALL_PLANTS_STATES_BY_USER: (state) => {
            state.ListAllPlantsCodesByUser = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "";
        },

        CLEAR_ALL_COLUMNS_STATES: (state) => {
            state.ListAllPlantsCodes = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA,
        FETCH_ALL_PLANTS_CODES_BY_USER,
        FETCH_ALL_PLANTS_CODES,
        CLEAR_ALL_PLANTS_STATES_BY_USER,
        CLEAR_ALL_COLUMNS_STATES
    } = columnBasedAccessControlSlice.actions;
export default columnBasedAccessControlSlice.reducer;