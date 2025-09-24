import { apiGet } from "@/lib/api-service";
import {
    FETCH_DASHBOARD_ANALYTICS
} from "@/redux/reducers/dashboard-reducer/dashboard-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchDashboardAnalytics = createAsyncThunk(
    "dashboard/fetchDashboardAnalytics",
    async ({ authToken, userId }: { authToken: string; userId?: string }, { dispatch }) => {
        // const response = await apiGet( `/neu-connect/v2/IDashboardFeature/GetDashboardAnalytics?userId=${userId}`, authToken);
        const url = userId
            ? `/neu-connect/v2/IDashboardFeature/GetDashboardAnalytics?userId=${userId}`
            : `/neu-connect/v2/IDashboardFeature/GetDashboardAnalytics`;

        const response = await apiGet(url, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_DASHBOARD_ANALYTICS(data?.data));
        };
    }
);

export {
    fetchDashboardAnalytics
};
