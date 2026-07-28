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

// Note: Action function fetch all ITR Data...!
const fetchAll_ITR_Data = createAsyncThunk(
    "itr/fetchAll_ITR_Data",
    async (
        { token, apiUrl, type, handleLoading, filterIndex, appliedFilter, lastCount = 10, skipRecords = 0 }:
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
        // console.log("Auth token: ", token);
        // console.log("API URL: ", apiUrl);
        // console.log("Type: ", type);
        // console.log("Filter Index: ", filterIndex);
        // console.log("Applied Filter: ", appliedFilter);

        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const modifiedApiUrl = (filterIndex != undefined && appliedFilter != undefined) ?
            (`${apiUrl}?${apiFilterParams[filterIndex || 0]}=${appliedFilter || ''}`) :
            apiUrl;
        console.log("Modified API URL: ", modifiedApiUrl);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": modifiedApiUrl,
                    "Auth-Token": token
                },
                params: params
            });
            console.log("Response in ITR action: ", response);
            const { status, data } = response;

            if (status == 200) {
                handleLoading(); // Note: Stop loading...!
                if (type === 'ITR') {
                    dispatch(FETCH_ALL_ITR_DATA({
                        data: data?.data?.data,
                        count: data?.data?.totalRecords
                    }))
                }
            };
        }

        catch (error: any) {
            // console.log(`Error occured in fetch all ${type} data integration:`, error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);

// Note: Action function fetch all IT Data...!
const fetchAll_IT_Data = createAsyncThunk(
    "it/fetchAll_IT_Data",
    async (
        { token, apiUrl, type, handleLoading, filterIndex, appliedFilter, lastCount = 10, skipRecords = 0 }:
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
        // console.log("Auth token: ", token);
        // console.log("API URL: ", apiUrl);
        // console.log("Type: ", type);
        // console.log("Filter Index: ", filterIndex);
        // console.log("Applied Filter: ", appliedFilter);

        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const modifiedApiUrl = (filterIndex != undefined && appliedFilter != undefined) ?
            (`${apiUrl}?${apiFilterParams[filterIndex || 0]}=${appliedFilter || ''}`) :
            apiUrl;
        console.log("Modified API URL: ", modifiedApiUrl);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": modifiedApiUrl,
                    "Auth-Token": token
                },
                params: params
            });
            console.log("Response in IT action: ", response);
            const { status, data } = response;

            if (status == 200) {
                handleLoading(); // Note: Stop loading...!
                if (type === 'IT') dispatch(FETCH_ALL_IT_DATA({
                    data: data?.data?.data,
                    count: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            // console.log(`Error occured in fetch all ${type} data integration:`, error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);

// Note: Action function fetch all TR Data...!
const fetchAll_TR_Data = createAsyncThunk(
    "tr/fetchAll_TR_Data",
    async (
        { token, apiUrl, type, handleLoading, filterIndex, appliedFilter, lastCount = 10, skipRecords = 0 }:
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
        // console.log("Auth token: ", token);
        // console.log("API URL: ", apiUrl);
        // console.log("Type: ", type);
        // console.log("Filter Index: ", filterIndex);
        // console.log("Applied Filter: ", appliedFilter);

        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const modifiedApiUrl = (filterIndex != undefined && appliedFilter != undefined) ?
            (`${apiUrl}?${apiFilterParams[filterIndex || 0]}=${appliedFilter || ''}`) :
            apiUrl;
        console.log("Modified API URL: ", modifiedApiUrl);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": modifiedApiUrl,
                    "Auth-Token": token
                },
                params: params
            });
            console.log("Response in TR action: ", response);
            const { status, data } = response;

            if (status == 200) {
                handleLoading(); // Note: Stop loading...!
                if (type === 'TR') dispatch(FETCH_ALL_TR_DATA({
                    data: data?.data?.data,
                    count: data?.data?.totalRecords
                }));
            };
        }

        catch (error: any) {
            // console.log(`Error occured in fetch all ${type} data integration:`, error);
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
    fetchAll_IT_Data,
    fetchAll_TR_Data
};