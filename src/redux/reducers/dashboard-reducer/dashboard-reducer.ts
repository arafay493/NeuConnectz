/***** Note: DashboardReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: DashboardStateType = {
    dashboardAnalyticsData: null,
    dashboardErrorState: "",
    userITRCountList: [],
    dailyITRTransferKPIs: [],
    ITRQuantity: [],
    ITRRequestsToWarehouse: [],
    ITRRequestsFromWarehouse: [],
    ITRAvgCloseTime: []
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_DASHBOARD_DATA: (state) => {
            state.dashboardAnalyticsData = null;
            state.dashboardErrorState = "You are not authorized to access this data!";
        },

        FETCH_DASHBOARD_ANALYTICS: (state, action: PayloadAction<any>) => {
            state.dashboardErrorState = "";
            state.dashboardAnalyticsData = action?.payload;
        },

        FETCH_ITR_DASHBOARD_USER_COUNT_LIST: (state, action: PayloadAction<any>) => {
            state.userITRCountList = action?.payload;
        },

        FETCH_ITR_DASHBOARD_DAILY_TRANSFER_KPI: (state, action: PayloadAction<any>) => {
            state.dailyITRTransferKPIs = action?.payload;
        },

        FETCH_ITR_DASHBOARD_QUANTITY: (state, action: PayloadAction<any>) => {
            state.ITRQuantity = action?.payload;
        },

        FETCH_ITR_DASHBOARD_REQUEST_TO_Warehouse: (state, action: PayloadAction<any>) => {
            state.ITRRequestsToWarehouse = action?.payload;
        },

        FETCH_ITR_DASHBOARD_REQUEST_FROM_Warehouse: (state, action: PayloadAction<any>) => {
            state.ITRRequestsFromWarehouse = action?.payload;
        },

        FETCH_ITR_DASHBOARD_AVERAGE_CLOSE_TIME: (state, action: PayloadAction<any>) => {
            state.ITRAvgCloseTime = action?.payload;
        },

        CLEAR_ALL_DASHBOARD_STATES: (state) => {
            state.dashboardAnalyticsData = null;
            state.dashboardErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_DASHBOARD_DATA,
        FETCH_DASHBOARD_ANALYTICS,
        FETCH_ITR_DASHBOARD_USER_COUNT_LIST,
        FETCH_ITR_DASHBOARD_DAILY_TRANSFER_KPI,
        FETCH_ITR_DASHBOARD_QUANTITY,
        FETCH_ITR_DASHBOARD_REQUEST_TO_Warehouse,
        FETCH_ITR_DASHBOARD_REQUEST_FROM_Warehouse,
        FETCH_ITR_DASHBOARD_AVERAGE_CLOSE_TIME,
        CLEAR_ALL_DASHBOARD_STATES
    } = dashboardSlice.actions;
export default dashboardSlice.reducer;