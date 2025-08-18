import { apiGet } from "@/lib/api-service";
import {
    FETCH_DASHBOARD_ANALYTICS
} from "@/redux/reducers/dashboard-reducer/dashboard-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchDashboardAnalytics = createAsyncThunk(
    "dashboard/fetchDashboardAnalytics",
    async (authToken: string, { dispatch }) => {
        const response = await apiGet('/neu-connect/v2/IDashboardFeature/GetDashboardAnalytics', authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_DASHBOARD_ANALYTICS(data?.data));
        };
    }
);

export {
    fetchDashboardAnalytics
};
