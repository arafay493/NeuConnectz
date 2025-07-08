/***** Note: ReconciliationReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReconsiliationStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ReconsiliationStateType = {
    reconsiliationErrorState: "",
    inventoryTransferItems: [],
    transferReceiptItems: []
};

const ReconciliationReducer = createSlice({
    name: "Reconciliation",
    initialState,
    reducers: {
        FETCH_IT_AND_TR_DATA: (state, action: PayloadAction<any>) => {
            console.log("fetch IT and TR data in reconciliation reducer: ", action.payload);
            state.inventoryTransferItems = action?.payload?.inventoryTransferItems;
            state.transferReceiptItems = action?.payload?.transferReceiptItems;
        },

        UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA: (state) => {
            state.inventoryTransferItems = [];
            state.transferReceiptItems = [];
            state.reconsiliationErrorState = "You are not authorized to access this data!";
        },

        CLEAR_ALL_ITR_STATES: (state) => {
            state.reconsiliationErrorState = "";
            state.inventoryTransferItems = [];
            state.transferReceiptItems = [];
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA,
        CLEAR_ALL_ITR_STATES,
        FETCH_IT_AND_TR_DATA
    } = ReconciliationReducer.actions;
export default ReconciliationReducer.reducer;