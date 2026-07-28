/***** Note: SAPReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SAPStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: SAPStateType = {
    listAll_ITR_IT_TRS: [],
    totalITR_IT_TRS_Counts : 0,
    list_GRNS_Data: [],
    sapErrorState: "",
    isSAPConfigExist: false,
    vendorCodeList: [],
    sapStagingDataCounts: null,
    totalGRNS_DataCounts: 0
};

const SAPReducer = createSlice({
    name: "sap",
    initialState,
    reducers: {
        CHECK_SAP_CONFIG_EXIST: (state, action: PayloadAction<any>) => {
            // console.log('Payload: ', action.payload);
            state.isSAPConfigExist = action.payload;
        },

        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.sapErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_ITR_IT_TRS: (state, action: PayloadAction<any>) => {
            // console.log("ITR_IT_TRS list data in sap reducer: ", action.payload);
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.listAll_ITR_IT_TRS = action?.payload?.listData;
            state.totalITR_IT_TRS_Counts = action?.payload?.counts;
        },

        FETCH_ALL_GRNS: (state, action: PayloadAction<any>) => {
            console.log("GRNS list data in sap reducer: ", action?.payload);
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.list_GRNS_Data = action?.payload?.grnsData;
            state.totalGRNS_DataCounts = action?.payload?.totalGRNSCount;
        },

        FETCH_ALL_VENDOR_CODES: (state, action: PayloadAction<any>) => {
            // console.log("Vendor code list data in sap reducer: ", action?.payload);
            state.vendorCodeList = action?.payload;
        },

        GET_SAP_STAGING_DATA_COUNTS: (state, action: PayloadAction<any>) => {
            // console.log("Sap staging counts in sap reducer: ", action?.payload);
            state.sapStagingDataCounts = action?.payload;
        },

        CLEAR_ALL_SAP_STATES: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.sapErrorState = "";
            state.isSAPConfigExist = false;
            state.vendorCodeList = [];
            state.sapStagingDataCounts = null;
        },
    }
});

export const
    {
        CHECK_SAP_CONFIG_EXIST,
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA,
        FETCH_ALL_ITR_IT_TRS,
        FETCH_ALL_GRNS,
        CLEAR_ALL_SAP_STATES,
        FETCH_ALL_VENDOR_CODES,
        GET_SAP_STAGING_DATA_COUNTS
    } = SAPReducer.actions;
export default SAPReducer.reducer;