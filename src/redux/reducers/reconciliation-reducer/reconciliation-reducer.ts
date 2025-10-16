/***** Note: WareHouseReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItTrStateProps } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ItTrStateProps = {
    inventoryTransferItems: [],
    transferReceiptItems: [],
    unReconciledITs: [],
    unReconciledITsCount: 0,
    unReconciledTRs: [],
    unReconciledTRsCount: 0,
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

        FETCH_RECONCILIATION_ITS: (state, action: PayloadAction<any>) => {
            state.reconciliationErrorState = "";
            state.unReconciledITs = action?.payload.data;
            state.unReconciledITsCount = action?.payload.totalCount;
        },

        FETCH_RECONCILIATION_TRS: (state, action: PayloadAction<any>) => {
            state.reconciliationErrorState = "";
            state.unReconciledTRs = action?.payload.data;
            state.unReconciledTRsCount = action?.payload.totalCount;
        },

        CLEAR_ALL_WAREHOUSE_STATES: (state) => {
            state.inventoryTransferItems = [];
            state.transferReceiptItems = [];
            state.reconciliationErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA,
        FETCH_RECONCILIATION_DATA,
        FETCH_RECONCILIATION_ITS,
        FETCH_RECONCILIATION_TRS
    } = reconciliationSlice.actions;

export default reconciliationSlice.reducer;
