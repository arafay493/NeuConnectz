/***** Note: SAPReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SAPStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: SAPStateType = {
    listAll_ITR_IT_TRS: [],
    list_GRNS_Data: [],
    pendingAndIntegratedData: null,
    sapErrorState: ""
};

const SAPReducer = createSlice({
    name: "sap",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.pendingAndIntegratedData = null;
            state.sapErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_ITR_IT_TRS: (state, action: PayloadAction<any>) => {
            // console.log("ITR_IT_TRS list data in sap reducer: ", action.payload);
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.pendingAndIntegratedData = null;

            state.listAll_ITR_IT_TRS = action?.payload?.listData;
            state.pendingAndIntegratedData = action?.payload?.pendingAndIntegratedData;
        },

        FETCH_ALL_GRNS: (state, action: PayloadAction<any>) => {
            console.log("GRNS list data in sap reducer: ", action?.payload);
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            // state.pendingAndIntegratedData = null;
            state.list_GRNS_Data = action?.payload?.grnsData;

            const mergePendingAndIntegratedData = { ...state.pendingAndIntegratedData , ...action?.payload?.counts };
            // console.log("Merge pending and integrated data: ", mergePendingAndIntegratedData);
            state.pendingAndIntegratedData = mergePendingAndIntegratedData;
        },

        CLEAR_ALL_SAP_STATES: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.pendingAndIntegratedData = null;
            state.sapErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA,
        FETCH_ALL_ITR_IT_TRS,
        FETCH_ALL_GRNS,
        CLEAR_ALL_SAP_STATES
    } = SAPReducer.actions;
export default SAPReducer.reducer;