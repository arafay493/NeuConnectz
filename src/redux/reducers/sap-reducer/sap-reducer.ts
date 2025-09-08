import { SAPStateType } from "@/types/redux-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState: SAPStateType = {
    listAll_ITR_IT_TRS: [],
    list_Pending_GRNS_Data: [],
    list_GRNS_Data: [],
    list_Integrated_GRNS_Data: [],
    sapErrorState: "",
    isSAPConfigExist: false,
    vendorCodeList: [],
    sapStagingDataCounts: null,
    totalGRNS_DataCounts: 0,
    listAll_ITR_IT_TRS_Count: 0,
    productionOrdersList: [],
    productionOrdersCount: 0,
    issuesForProductionList: [],
    issuesForProductionCount: 0,
    recieptFromProductionList: [],
    recieptFromProductionCount: 0,

    listOfProductionOrderLines: [],
    productionOrderLinesCount: 0,
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
            state.productionOrdersList = [];
            state.productionOrdersCount = 0;
            state.issuesForProductionList = [];
            state.issuesForProductionCount = 0;
            state.recieptFromProductionList = [];
            state.recieptFromProductionCount = 0;
            state.listOfProductionOrderLines = [];
            state.productionOrderLinesCount = 0;
        },

        FETCH_ALL_PRODUCTION_ORDERS: (state, action: PayloadAction<any>) => {
            // console.log('Production order data in sap reducer: ', action?.payload);
            state.productionOrdersList = action?.payload?.productionOrdersData;
            state.productionOrdersCount = action?.payload?.totalproductionOrdersCount;
        },

        FETCH_ALL_ISSUES_FOR_PRODUCTION: (state, action: PayloadAction<any>) => {
            // console.log('Issues for production data in sap reducer: ', action?.payload);
            state.issuesForProductionList = action?.payload?.issuesForProductionData;
            state.issuesForProductionCount = action?.payload?.totalIssuesForProductionCount;
        },

        FETCH_ALL_RECIEPT_FROM_PRODUCTION: (state, action: PayloadAction<any>) => {
            // console.log('Reciept from Production data in sap reducer: ', action?.payload);
            state.recieptFromProductionList = action?.payload?.recieptFromProductionData;
            state.recieptFromProductionCount = action?.payload?.totalRecieptFromProductionCount;
        },

        FETCH_ALL_PRODUCTION_ORDERS_LINES_DATA: (state, action: PayloadAction<any>) => {
            // console.log('Production order lines data in sap reducer: ', action?.payload);
            state.listOfProductionOrderLines = [];
            state.listOfProductionOrderLines = action?.payload?.listOfProductionOrderLinesData;
            state.productionOrderLinesCount = action?.payload?.totalCountOfProductionOrderLines;
        },

        CLEAR_ALL_PRODUCTION_ORDERS_LINES_DATA: (state) => {
            state.listOfProductionOrderLines = [];
            state.productionOrderLinesCount = 0;
        },
    }
});

export const
    {
        CHECK_SAP_CONFIG_EXIST,
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA,
        FETCH_ALL_ITR_IT_TRS,
        FETCH_ALL_GRNS,
        FETCH_ALL_INTEGRATED_GRNS,
        FETCH_ALL_PENDING_GRNS,
        CLEAR_ALL_SAP_STATES,
        FETCH_ALL_VENDOR_CODES,
        GET_SAP_STAGING_DATA_COUNTS,
        FETCH_ALL_PRODUCTION_ORDERS,
        FETCH_ALL_ISSUES_FOR_PRODUCTION,
        FETCH_ALL_RECIEPT_FROM_PRODUCTION,
        FETCH_ALL_PRODUCTION_ORDERS_LINES_DATA,
        CLEAR_ALL_PRODUCTION_ORDERS_LINES_DATA
    } = SAPReducer.actions;
export default SAPReducer.reducer;