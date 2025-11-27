/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlantsStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState = {
    putaway_columns: {
        serialNumber: {
            label: "S.No",
            value: true,
        },
        docNum: {
            label: "Doc Number",
            value: true,
        },
        transferReceiptNumber: {
            label: "TR Number",
            value: true,
        },
        material: {
            label: "Material Code",
            value: true,
        },
        materialDescription: {
            label: "Material Name",
            value: true,
        },
        materialDocument: {
            label: "Material Doc",
            value: true,
        },
        baseUOM: {
            label: "UOM",
            value: true,
        },
        totalQuantity: {
            label: "Quantity",
            value: true,
        },
        movementType: {
            label: "Movement Type",
            value: true,
        },
        purchaseOrder: {
            label: "Purchase Order",
            value: true,
        },
        supplierName: {
            label: "Suppliers",
            value: true,
        },
        sourceStorageBin: {
            label: "Source Bin",
            value: true,
        },
        confirmationStatus: {
            label: "Status",
            value: true,
        },
        createdOn: {
            label: "Date",
            value: true,
        },
        actions: {
            label: "Actions",
            value: true,
        },
    },
    userList: {}
};


const columnBasedAccessControlSlice = createSlice({
    name: "columnBasedAccessControl",
    initialState,
    reducers: {
        PUTAWAY_UNPOSTED: (state, action: PayloadAction<any>) => {
            state.putaway_columns = action?.payload
        }
        // UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA: (state) => {
        //     state.ListAllPlantsCodes = {
        //         data: [],
        //         totalCount: 0
        //     };
        //     state.PlantsErrorState = "You are not authorized to access this data!";
        // },

        // FETCH_ALL_PLANTS_CODES: (state, action: PayloadAction<any>) => {
        //     state.PlantsErrorState = "";
        //     state.ListAllPlantsCodes = action?.payload;
        // },

        // FETCH_ALL_PLANTS_CODES_BY_USER: (state, action: PayloadAction<any>) => {
        //     state.PlantsErrorState = "";
        //     state.ListAllPlantsCodesByUser = action?.payload;
        // },

        // CLEAR_ALL_PLANTS_STATES_BY_USER: (state) => {
        //     state.ListAllPlantsCodesByUser = {
        //         data: [],
        //         totalCount: 0
        //     };
        //     state.PlantsErrorState = "";
        // },

        // CLEAR_ALL_COLUMNS_STATES: (state) => {
        //     state.ListAllPlantsCodes = {
        //         data: [],
        //         totalCount: 0
        //     };
        //     state.PlantsErrorState = "";
        // },
    }
});

export const
    {
        // UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA,
        // FETCH_ALL_PLANTS_CODES_BY_USER,
        // FETCH_ALL_PLANTS_CODES,
        // CLEAR_ALL_PLANTS_STATES_BY_USER,
        // CLEAR_ALL_COLUMNS_STATES,
        PUTAWAY_UNPOSTED
    } = columnBasedAccessControlSlice.actions;
export default columnBasedAccessControlSlice.reducer;