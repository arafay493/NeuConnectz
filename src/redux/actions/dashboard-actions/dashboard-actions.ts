import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet } from "@/lib/api-service";
import {
    FETCH_DASHBOARD_ANALYTICS,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_DASHBOARD_DATA
} from "@/redux/reducers/dashboard-reducer/dashboard-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchDashboardAnalytics = createAsyncThunk(
    "dashboard/fetchDashboardAnalytics",
    async (authToken: string, { dispatch }) => {
        try {
            // Using the proxy route for auth
            const response = await apiGet('/neu-connect/v2/IDashboardFeature/GetDashboardAnalytics', authToken);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_DASHBOARD_ANALYTICS(data?.data));
            };
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_DASHBOARD_DATA());
        };
    }
);

export {
    fetchDashboardAnalytics
};