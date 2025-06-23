/***** Note: SAPReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SAPStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: SAPStateType = {
    listAll_ITR_IT_TRS: [],
    pendingAndIntegratedData: null,
    sapErrorState: ""
};

const SAPReducer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.sapErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_ITR_IT_TRS: (state, action: PayloadAction<any>) => {
            // console.log("ITR_IT_TRS list data in sap reducer: ", action.payload);
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.pendingAndIntegratedData = null;

            state.listAll_ITR_IT_TRS = action?.payload?.listData;
            state.pendingAndIntegratedData = action?.payload?.pendingAndIntegratedData;
        },

        CLEAR_ALL_SAP_STATES: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.pendingAndIntegratedData = null;
            state.sapErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA,
        FETCH_ALL_ITR_IT_TRS,
        CLEAR_ALL_SAP_STATES
    } = SAPReducer.actions;
export default SAPReducer.reducer;