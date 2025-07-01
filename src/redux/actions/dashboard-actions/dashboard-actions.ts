// Note: All dashboard action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import {
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_DASHBOARD_DATA,
    FETCH_DASHBOARD_ANALYTICS
}
    from "@/redux/reducers/dashboard-reducer/dashboard-reducer";
import { handleRefreshToken } from "@/constants/refresh-token";
// import { ResHandler } from "@/types/api-types";

// Note: Action function to fetch dashboard analytics...!
const fetchDashboardAnalytics = createAsyncThunk(
    "dashboard/fetchDashboardAnalytics",
    async (authToken: string, { dispatch }) => {
        // console.log("Auth token: ", authToken);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_DASHBOARD_ANALYTICS,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in dashbaord action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_DASHBOARD_ANALYTICS(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch dashboard analytics api integration: ', error);
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