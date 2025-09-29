/***** Note: DashboardReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: DashboardStateType = {
    dashboardAnalyticsData: null,
    dashboardErrorState: ""
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
        CLEAR_ALL_DASHBOARD_STATES
    } = dashboardSlice.actions;
export default dashboardSlice.reducer;