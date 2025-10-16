import { apiGet } from "@/lib/api-service";
import {
    FETCH_DASHBOARD_ANALYTICS,
    FETCH_ITR_DASHBOARD_AVERAGE_CLOSE_TIME,
    FETCH_ITR_DASHBOARD_DAILY_TRANSFER_KPI,
    FETCH_ITR_DASHBOARD_QUANTITY,
    FETCH_ITR_DASHBOARD_REQUEST_FROM_Warehouse,
    FETCH_ITR_DASHBOARD_REQUEST_TO_Warehouse,
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
    "dashboard/fetchITRDashboardUserCount",
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

const fetchITRDashboardDailyTranferKPI = createAsyncThunk(
    "dashboard/fetchITRDashboardDailyTransferKPI",
    async ({ authToken }: { authToken: string }, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetDailyTransferKPI`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_DAILY_TRANSFER_KPI(data?.data));
            return data?.data;
        };

        return null; // fallback
    }
);

const fetchITRDashboardQuantity = createAsyncThunk(
    "dashboard/fetchITRDashboardQuantity",
    async ({ authToken, startDate, endDate }: { authToken: string, startDate?: string, endDate?: string }, { dispatch }) => {
        const params: { [key: string]: string } = {};
        if (startDate !== undefined) params.startDate = startDate;
        if (endDate !== undefined) params.endDate = endDate;
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetItemRequestsPerPeriod`, authToken, params);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_QUANTITY(data?.data));
            return data?.data;
        };

        return null; // fallback
    }
);

const fetchITRDashboardRequestsByDestinationWarehouse = createAsyncThunk(
    "dashboard/fetchITRDashboardRequestsByDestinationWarehouse",
    async ({ authToken }: { authToken: string }, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetRequestsByDestinationWarehouse`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_REQUEST_TO_Warehouse(data?.data));
            return data?.data;
        };

        return null;
    }
);

const fetchITRDashboardRequestsBySourceWarehouse = createAsyncThunk(
    "dashboard/fetchITRDashboardRequestsBySourceWarehouse",
    async ({ authToken }: { authToken: string }, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetRequestsBySourceWarehouse`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_REQUEST_FROM_Warehouse(data?.data));
            return data?.data;
        };

        return null;
    }
);

const fetchITRDashboardAverageCloseTime = createAsyncThunk(
    "dashboard/fetchITRDashboardAverageCloseTime",
    async ({ authToken }: { authToken: string }, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IItrDashboardFeature/GetAverageCloseTime`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITR_DASHBOARD_AVERAGE_CLOSE_TIME(data?.data));
            return data?.data;
        };

        return null;
    }
);

export {
    fetchDashboardAnalytics,
    fetchITRDashboardUserCountList,
    fetchITRDashboardDailyTranferKPI,
    fetchITRDashboardQuantity,
    fetchITRDashboardRequestsByDestinationWarehouse,
    fetchITRDashboardRequestsBySourceWarehouse,
    fetchITRDashboardAverageCloseTime
};
