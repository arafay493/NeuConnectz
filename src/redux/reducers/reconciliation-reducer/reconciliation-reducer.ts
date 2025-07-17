/***** Note: WareHouseReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItTrStateProps } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ItTrStateProps = {
    inventoryTransferItems: [],
    transferReceiptItems: [],
    reconciliationErrorState: ''
};

const reconciliationSlice = createSlice({
    name: "reconciliation",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA: (state) => {
            state.inventoryTransferItems = [];
            state.transferReceiptItems = [];
            state.reconciliationErrorState = "You are not authorized to access this data!";
        },

        FETCH_RECONCILIATION_DATA: (state, action: PayloadAction<any>) => {
            state.reconciliationErrorState = "";
            state.inventoryTransferItems = action?.payload.inventoryTransferItems;
            state.transferReceiptItems = action?.payload.transferReceiptItems;
        },

        // FETCH_WAREHOUSES_BY_USER_ID: (state, action: PayloadAction<any>) => {
        //     // console.log("Warehouses list by user id data in reducer: ", action.payload);
        //     state.warehouseErrorState = "";
        //     state.warehousesListByUserId = [];
        //     state.warehousesListByUserId = action?.payload;
        // },

        // CLEAR_ALL_WAREHOUSE_STATES: (state) => {
        //     state.wareHousesList = [];
        //     state.warehousesListByUserId = [];
        //     state.warehouseErrorState = "";
        // },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA,
        FETCH_RECONCILIATION_DATA,
    } = reconciliationSlice.actions;

export default reconciliationSlice.reducer;
