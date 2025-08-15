import API_METHODS from "@/constants/api-methods";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import {
    CHECK_SAP_CONFIG_EXIST,
    FETCH_ALL_GRNS,
    FETCH_ALL_INTEGRATED_GRNS,
    FETCH_ALL_ITR_IT_TRS,
    FETCH_ALL_PENDING_GRNS,
    FETCH_ALL_VENDOR_CODES,
    GET_SAP_STAGING_DATA_COUNTS,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA
} from "@/redux/reducers/sap-reducer/sap-reducer";
import { ResHandler } from "@/types/api-types";
import { AddSAPConfigDataType } from "@/types/modules/sap-types/sap-types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Note: Action function to add SAP configuration...!
const addSAPConfiguration = createAsyncThunk(
    "sap/addSAPConfiguration",
    async (
        { token, sapConfigData, resHandler }:
            {
                token: string,
                sapConfigData: AddSAPConfigDataType,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: sapConfigData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ADD_SAP_CONFIGURATION,
                    "Auth-Token": token
                }
            });
            const { status, data } = response;

            if (status == 200) {
                resHandler(response);
            };
        } catch (error: any) {
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                handleRefreshToken(data?.error);
            };
        };
    }
);

// Note: Action function to post ITR, TR, IT , GRN request to SAP...!
const postRequestToSAP = createAsyncThunk(
    "sap/postRequestToSAP",
    async (
        { token, type, apiUrl, resHandler }:
            {
                token: string,
                type: string,
                apiUrl: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        try {
            const response = await apiPost(`/neu-connect/v2/${apiUrl}`, { userName: type }, token);

            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        } catch (error: any) {
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                handleRefreshToken(data?.error);
            };
        };
    }
);

// Note: Action function fetch all ITR_IT_TRS...!
const fetchAllITR_IT_TRS = createAsyncThunk(
    "sap/fetchAllITR_IT_TRS",
    async (
        { token, dataStatus, handleLoading, type, lastCount, skipRecords }:
            {
                token: string,
                dataStatus: string,
                handleLoading: () => void,
                type?: "ITR" | "TR" | "IT",
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const apiUrl = !type ? `/neu-connect/v2/${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}` :
            `/neu-connect/v2/${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}&type=${type}`;
        try {
            const response = await apiGet(apiUrl, token, params);

            const { status } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_ITR_IT_TRS({
                    listData: response?.data?.data?.data,
                    listCount: response?.data?.data?.totalRecords
                }));
                handleLoading(); // Disable loading state...!
            };
        } catch (error: any) {
            console.log('Error occurred in fetch all ITR, TR, IT data api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function fetch all GRNS...!
const fetchAll_GRNS = createAsyncThunk(
    "sap/fetchAll_GRNS",
    async (
        { token, handleLoading, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                handleLoading: () => void,
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

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token, params);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_GRNS({
                    grnsData: data?.data?.items,
                    totalGRNSCount: data?.data?.totalRecords
                }));
                handleLoading(); // Disable loading state...!
            };
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function fetch all GRNS...!
const fetchAll_PENDING_GRNS = createAsyncThunk(
    "sap/fetchAll_GRNS",
    async (
        { token, handleLoading, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                handleLoading: () => void,
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

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token, params);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_PENDING_GRNS({
                    grnsData: data?.data?.items,
                    totalGRNSCount: data?.data?.totalRecords
                }));
                handleLoading(); // Disable loading state...!
            };
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function fetch all GRNS...!
const fetchAll_INTEGRATED_GRNS = createAsyncThunk(
    "sap/fetchAll_GRNS",
    async (
        { token, handleLoading, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                handleLoading: () => void,
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

            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token, params);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_INTEGRATED_GRNS({
                    grnsData: data?.data?.items,
                    totalGRNSCount: data?.data?.totalRecords
                }));
                handleLoading(); // Disable loading state...!
            };
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function to check is SAP config exist...!
const checkSAPConfigExist = createAsyncThunk(
    "sap/checkSAPConfigExist",
    async (token: string, { dispatch }) => {

        try {
            const response = await apiGet(`/neu-connect/v2/ISapFeature/CheckIfSapConfigurationExists`, token);

            const { status, data } = response;

            if (status == 200) dispatch(CHECK_SAP_CONFIG_EXIST(data?.data));
        } catch (error: any) {
            console.log('Error occurred in check SAP config exist api integration: ', error);
            // const { status, data } = error?.response;

            // 401:
            // if (status == 401) handleRefreshToken(data?.error);

            // 403
            // else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function to get SAP data...!
const getSAPData = createAsyncThunk(
    "sap/getSAPData",
    async (
        { token, apiUrl, resHandler }:
            {
                token: string,
                apiUrl: string,
                resHandler: ResHandler
            },
        { dispatch }) => {
        try {
            const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token);

            const { status, data } = response;

            if (status == 200) resHandler(data);
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function to export data to csv...!
const exportDataToCsvFile = createAsyncThunk(
    "sap/exportDataToCsvFile",
    async (
        { token, apiUrl, type }:
            {
                token: string,
                apiUrl: string,
                type: string
            },
        { dispatch }) => {
        try {
            const response = await fetch(apiRequestRoutes.getRequest, {
                method: 'GET',
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": token
                }
            });

            const csvText = await response.text();

            // Remove outer double quotes if present
            const trimmedCsvText = csvText.replace(/^"|"$/g, '');

            // Convert \n to actual line breaks for proper CSV formatting
            const formattedCsvText = trimmedCsvText.replace(/\\n/g, '\n');

            // Extract filename from content-disposition header or use default
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()} - ${type}.csv`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename\?=(?:UTF-8''|)([^;\n])/);
                if (match && match[1]) {
                    filename = decodeURIComponent(match[1].replace(/"/g, ''));
                };
            };

            // Create blob from formatted CSV text
            const blob = new Blob([formattedCsvText], { type: 'text/csv;charset=utf-8;' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`CSV file downloaded successfully: ${filename}`);
            return { success: true, filename, recordCount: formattedCsvText.split('\n').length - 1 };
        } catch (error) {
            console.log("Something went wrong while exporting data to csv: ", error);
        };
    }
);

// Note: Action function fetch all vendor codes...!
const fetchAllVendorCodes = createAsyncThunk(
    "sap/fetchAllVendorCodes",
    async (token: string, { dispatch }) => {
        try {
            const response = await apiGet(`/neu-connect/v2/ISapFeature/ListBusinessPartnerVendors`, token);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_VENDOR_CODES(data?.data?.data));
            };
        } catch (error: any) {
            console.log('Error occurred in fetch all vendor codes data api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

// Note: Action function to get sap staging data counts...!
const handleGetSapStagingDataCounts = createAsyncThunk(
    "sap/handleGetSapStagingDataCounts",
    async (token: string, { dispatch }) => {
        try {
            const response = await apiGet(`/neu-connect/v2/IFetchNewDataFromSAPFeature/GetSapStagingDataCounts`, token);

            const { status, data } = response;

            if (status == 200) {
                dispatch(GET_SAP_STAGING_DATA_COUNTS(data?.data));
            };
        } catch (error: any) {
            console.log('Error occurred in getting sap staging data counts api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

export {
    addSAPConfiguration, checkSAPConfigExist, exportDataToCsvFile, fetchAll_GRNS, fetchAll_INTEGRATED_GRNS, fetchAll_PENDING_GRNS, fetchAllITR_IT_TRS, fetchAllVendorCodes, getSAPData, handleGetSapStagingDataCounts, postRequestToSAP
};

