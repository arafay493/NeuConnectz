import { SAPStateType } from "@/types/redux-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState: SAPStateType = {
    listAll_ITR_IT_TRS: [],
    list_Pending_GRNS_Data: [],
    list_GRNS_Data: [],
    list_Integrated_GRNS_Data: [],
    list_Item_Code_Data: [],
    list_item_Code_Data_By_Group_Id: null,
    totalItemCodeCount: 0,
    sapErrorState: "",
    isSAPConfigExist: false,
    vendorCodeList: [],
    sapStagingDataCounts: null,
    totalGRNS_DataCounts: 0,
    listAll_ITR_IT_TRS_Count: 0
};

const SAPReducer = createSlice({
    name: "sap",
    initialState,
    reducers: {
        CHECK_SAP_CONFIG_EXIST: (state, action: PayloadAction<any>) => {
            state.isSAPConfigExist = action.payload;
        },

        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_Pending_GRNS_Data = [];
            state.list_Integrated_GRNS_Data = [];
            state.sapErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_ITR_IT_TRS: (state, action: PayloadAction<any>) => {
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_Pending_GRNS_Data = [];
            state.list_Integrated_GRNS_Data = [];
            state.listAll_ITR_IT_TRS = action?.payload?.listData;
            state.listAll_ITR_IT_TRS_Count = action?.payload?.listCount;
        },

        FETCH_ALL_ITEM_CODES: (state, action: PayloadAction<any>) => {
            if (action?.payload?.items && Array.isArray(action?.payload?.items)) {
                state.list_Item_Code_Data = action.payload.items;
                state.totalItemCodeCount = action?.payload?.totalRecords || 0;
            } else if (Array.isArray(action?.payload)) {
                state.list_Item_Code_Data = action.payload;
                state.totalItemCodeCount = action.payload.length;
            } else {
                state.list_Item_Code_Data = null;
                state.totalItemCodeCount = 0;
            }
        },

        FETCH_ITEM_BY_GROUP_ID: (state, action: PayloadAction<any>) => {
            state.list_item_Code_Data_By_Group_Id = action.payload;
        },

        FETCH_ALL_GRNS: (state, action: PayloadAction<any>) => {
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_GRNS_Data = [];
            state.list_GRNS_Data = action?.payload?.grnsData;
            state.totalGRNS_DataCounts = action?.payload?.totalGRNSCount
        },

        FETCH_ALL_PENDING_GRNS: (state, action: PayloadAction<any>) => {
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_Pending_GRNS_Data = action?.payload?.grnsData;
            state.totalGRNS_DataCounts = action?.payload?.totalGRNSCount
        },

        FETCH_ALL_INTEGRATED_GRNS: (state, action: PayloadAction<any>) => {
            state.sapErrorState = "";
            state.listAll_ITR_IT_TRS = [];
            state.list_Integrated_GRNS_Data = action?.payload?.grnsData;
            state.totalGRNS_DataCounts = action?.payload?.totalGRNSCount
        },



        FETCH_ALL_VENDOR_CODES: (state, action: PayloadAction<any>) => {
            state.vendorCodeList = action?.payload;
        },

        GET_SAP_STAGING_DATA_COUNTS: (state, action: PayloadAction<any>) => {
            state.sapStagingDataCounts = action?.payload;
        },
        CLEAR_ALL_SAP_STATES: (state) => {
            state.listAll_ITR_IT_TRS = [];
            state.list_Integrated_GRNS_Data = [];
            state.list_Pending_GRNS_Data = [];
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
        FETCH_ALL_ITEM_CODES,
        FETCH_ITEM_BY_GROUP_ID,
        FETCH_ALL_GRNS,
        FETCH_ALL_INTEGRATED_GRNS,
        FETCH_ALL_PENDING_GRNS,
        CLEAR_ALL_SAP_STATES,
        FETCH_ALL_VENDOR_CODES,
        GET_SAP_STAGING_DATA_COUNTS
    } = SAPReducer.actions;
export default SAPReducer.reducer;