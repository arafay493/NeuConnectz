// Note: All ITR action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_METHODS from "@/constants/api-methods";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import {
    FETCH_ALL_ITR_DATA,
    FETCH_ALL_TR_DATA,
    FETCH_ALL_IT_DATA,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA,
} from "@/redux/reducers/itr-reducer/itr-reducer";
import { apiFilterParams } from "@/constants/filters";

// Note: Action function to fetch list all group codes...!
const fetchAllItrData = createAsyncThunk(
    "stock-movement/fetchAllItrData",
    async (
        { authToken, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: {
                    lastCount,
                    skipRecords
                },
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": authToken
                }
            });

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_ITR_DATA({
                    itrData: data?.data?.data,
                    itrDataCount: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);
const fetchAllTrData = createAsyncThunk(
    "stock-movement/fetchAllTrData",
    async (
        { authToken, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: {
                    lastCount,
                    skipRecords
                },
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": authToken
                }
            });

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_TR_DATA({
                    trData: data?.data?.data,
                    trDataCount: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);
const fetchAllItData = createAsyncThunk(
    "stock-movement/fetchAllItData",
    async (
        { authToken, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: {
                    lastCount,
                    skipRecords
                },
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": authToken
                }
            });

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_IT_DATA({
                    itData: data?.data?.data,
                    itDataCount: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);

// Note: Action function fetch all ITR Data...!
const fetchAll_ITR_Data = createAsyncThunk(
    "itr/fetchAll_ITR_Data",
    async (
        { token, apiUrl, type, handleLoading, filterIndex, appliedFilter, lastCount, skipRecords }:
            {
                token: string,
                apiUrl: string,
                type: string,
                handleLoading: () => void,
                filterIndex?: number,
                appliedFilter?: string | null,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const modifiedApiUrl = (filterIndex != undefined && appliedFilter != undefined) ?
            (`${apiUrl}?${apiFilterParams[filterIndex || 0]}=${appliedFilter || ''}`) :
            apiUrl;
        // console.log("Modified API URL: ", modifiedApiUrl);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: {
                    lastCount,
                    skipRecords
                },
                headers: {
                    "Api-Url": modifiedApiUrl,
                    "Auth-Token": token
                }
            });
            // console.log("Response in ITR action: ", response);
            const { status, data } = response;

            if (status == 200) {
                handleLoading(); // Note: Stop loading...!
                if (type === 'ITR') {
                    dispatch(FETCH_ALL_ITR_DATA({
                        itrData: data?.data?.data,
                        itrDataCount: data?.data?.totalRecords
                    }))
                }
                else if (type === 'TR') dispatch(FETCH_ALL_TR_DATA({
                    trData: data?.data?.data,
                    trDataCount: data?.data?.totalRecords
                }));
                else if (type === 'IT') dispatch(FETCH_ALL_IT_DATA({
                    itData: data?.data?.data,
                    itDataCount: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            console.log(`Error occured in fetch all ${type} data integration:`, error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);

export {
    fetchAll_ITR_Data,
    fetchAllItrData,
    fetchAllItData,
    fetchAllTrData
};