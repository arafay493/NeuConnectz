import { apiFilterParams } from "@/constants/filters";
import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet } from "@/lib/api-service";
import {
    FETCH_ALL_IT_DATA,
    FETCH_ALL_ITR_DATA,
    FETCH_ALL_TR_DATA,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA,
} from "@/redux/reducers/itr-reducer/itr-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
            const params: { [key: string]: number } = {};
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, authToken, params);

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
            const params: { [key: string]: number } = {};
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, authToken, params);

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
            const params: { [key: string]: number } = {};
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, authToken, params);

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
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const modifiedApiUrl = (filterIndex != undefined && appliedFilter != undefined) ?
            (`${apiUrl}?${apiFilterParams[filterIndex || 0]}=${appliedFilter || ''}`) :
            apiUrl;
        try {
            const response = await apiGet(`/neu-connect/v2/${modifiedApiUrl}`, token, params);

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
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA());
        };
    }
);

export {
    fetchAll_ITR_Data, fetchAllItData, fetchAllItrData, fetchAllTrData
};

