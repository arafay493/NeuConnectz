import { apiGet } from "@/lib/api-service";
import {
    FETCH_DASHBOARD_ANALYTICS,
    FETCH_ITR_DASHBOARD_USER_COUNT_LIST
} from "@/redux/reducers/dashboard-reducer/dashboard-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchDashboardAnalytics = createAsyncThunk(
    "dashboard/fetchDashboardAnalytics",
    async ({ authToken, userId }: any, { dispatch }) => {
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

const fetchITRDashboardUserCountList = createAsyncThunk(
    "dashboard/fetchITRDashboardAnalytics",
    async ({ authToken }: { authToken: string }, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetUserITRCount`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_USER_COUNT_LIST(data?.data));
            return data?.data;
        };

        return null; // fallback
    }
);

export {
    fetchDashboardAnalytics,
    fetchITRDashboardUserCountList
};
