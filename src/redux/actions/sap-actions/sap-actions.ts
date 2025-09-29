import API_METHODS from "@/constants/api-methods";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import {
    CHECK_SAP_CONFIG_EXIST,
    FETCH_ALL_GRNS,
    FETCH_ALL_INTEGRATED_GRNS,
    FETCH_ALL_ITR_IT_TRS,
    FETCH_ALL_PENDING_GRNS,
    FETCH_ALL_VENDOR_CODES,
    GET_SAP_STAGING_DATA_COUNTS,
    FETCH_ALL_PRODUCTION_ORDERS,
    FETCH_ALL_ISSUES_FOR_PRODUCTION,
    FETCH_ALL_RECIEPT_FROM_PRODUCTION,
    FETCH_ALL_PRODUCTION_ORDERS_LINES_DATA,
    FETCH_PRODUCTION_ORDERS_DOCUMENT_STATES,
    FETCH_LIST_AGAINST_PO
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
            console.log('SAP Api Res: ', response);

            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
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

        const apiUrl = !type ? `/neu-connect/v2${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}` :
            `/neu-connect/v2${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}&type=${type}`;

        const response = await apiGet(apiUrl, token, params);

        const { status } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_ITR_IT_TRS({
                listData: response?.data?.data?.data,
                listCount: response?.data?.data?.totalRecords
            }));
            handleLoading(); // Disable loading state...!
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
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_GRNS({
                grnsData: data?.data?.items,
                totalGRNSCount: data?.data?.totalRecords
            }));
            handleLoading(); // Disable loading state...!
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
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_PENDING_GRNS({
                grnsData: data?.data?.items,
                totalGRNSCount: data?.data?.totalRecords
            }));
            handleLoading(); // Disable loading state...!
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
        console.log("🚀 ~ apiUrl:", apiUrl)
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_INTEGRATED_GRNS({
                grnsData: data?.data?.items,
                totalGRNSCount: data?.data?.totalRecords
            }));
            handleLoading(); // Disable loading state...!
        };
    }
);

// Note: Action function to check is SAP config exist...!
const checkSAPConfigExist = createAsyncThunk(
    "sap/checkSAPConfigExist",
    async (token: string, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/ISapFeature/CheckIfSapConfigurationExists`, token);

        const { status, data } = response;

        if (status == 200) dispatch(CHECK_SAP_CONFIG_EXIST(data?.data));
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
        const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token);

        const { status, data } = response;

        if (status == 200) resHandler(data);
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
            console.log("Export to CSV apiUrl: ", apiUrl);
            console.log("SAP Token: ", token);
            const response = await fetch(
                `http://zconnectstaging.qbscocloud.net:31155/ZCAPI${apiUrl}`,
                {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log("SAP Export to CSV response: ", response);

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
        const response = await apiGet(`/neu-connect/v2/ISapFeature/ListBusinessPartnerVendors`, token);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_VENDOR_CODES(data?.data?.data));
        };
    }
);

// Note: Action function to get sap staging data counts...!
const handleGetSapStagingDataCounts = createAsyncThunk(
    "sap/handleGetSapStagingDataCounts",
    async (token: string, { dispatch }) => {
        const response = await apiGet(`/neu-connect/v2/IFetchNewDataFromSAPFeature/GetSapStagingDataCounts`, token);

        const { status, data } = response;

        if (status == 200) {
            dispatch(GET_SAP_STAGING_DATA_COUNTS(data?.data));
        };
    }
);

// Note: Action function fetch production orders list...!
const fetchAllProductionOrders = createAsyncThunk(
    "sap/fetchAllProductionOrders",
    async (
        { token, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.pageSize = lastCount;
        if (skipRecords !== undefined) params.pageNumber = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);
        // console.log("Fetch all production orders api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_PRODUCTION_ORDERS({
                productionOrdersData: data?.data?.productionOrders,
                totalproductionOrdersCount: data?.data?.totalCount
            }));
        };
    }
);

// Note: Action function fetch issues for production list...!
const fetchIssuesForProductionList = createAsyncThunk(
    "sap/fetchIssuesForProductionList",
    async (
        { token, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);
        // console.log("Fetch all isseus for production api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_ISSUES_FOR_PRODUCTION({
                issuesForProductionData: data?.data?.issueForProduction,
                totalIssuesForProductionCount: data?.data?.totalCount
            }));
        }

        else if (status == 404) {
            dispatch(FETCH_ALL_ISSUES_FOR_PRODUCTION({
                issuesForProductionData: [],
                totalIssuesForProductionCount: 0
            }));
        };
    }
);

// Note: Action function fetch reciept from production list...!
const fetchRecieptFromProductionList = createAsyncThunk(
    "sap/fetchRecieptFromProductionList",
    async (
        { token, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);
        // console.log("Fetch all reciept from production api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_RECIEPT_FROM_PRODUCTION({
                recieptFromProductionData: data?.data?.recieptFormProduction,
                totalRecieptFromProductionCount: data?.data?.totalCount
            }));
        }

        else if (status == 404) {
            dispatch(FETCH_ALL_RECIEPT_FROM_PRODUCTION({
                recieptFromProductionData: [],
                totalRecieptFromProductionCount: 0
            }));
        }
    }
);

// Note: Action function to fetch list of production orders lines...!
const fetchProductionOrdersLinesList = createAsyncThunk(
    "sap/fetchProductionOrdersLinesList",
    async (
        { docEntry, token, apiUrl, lastCount, skipRecords }:
            {
                docEntry: number,
                token: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        // const params: { [key: string]: number } = {};
        // if (lastCount !== undefined) params.pageSize = lastCount;
        // if (skipRecords !== undefined) params.pageNumber = skipRecords;

        const response = await apiGet(`/neu-connect/v2/${apiUrl}?Docentry=${docEntry}`, token);
        // console.log("Fetch all production order lines api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_PRODUCTION_ORDERS_LINES_DATA({
                listOfProductionOrderLinesData: data?.data?.values[0]?.stockTransferLines,
                totalCountOfProductionOrderLines: data?.data?.totalRecords
            }));
        };
    }
);

// Note: Action function to close production order...!
const closeProductionOrder = createAsyncThunk(
    "sap/closeProductionOrder",
    async (
        { token, docEntry, resHandler }:
            {
                token: string,
                docEntry: number,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        console.log("Doc Entry to close production order: ", docEntry);

        const response = await apiPut(`/neu-connect/v2/${process.env.NEXT_PUBLIC_PRODUCTION_CLOSE_PRODUCTION_ORDER}?DocEntry=${docEntry}`, token);
        console.log("Close production order: ", response);

        const { status, data } = response;

        if (status == 200) {
            resHandler(response);
        };
    }
);

// Note: Action function fetch production orders list...!
const fetchProductionOrderDocumentStats = createAsyncThunk(
    "sap/fetchProductionOrderDocumentStats",
    async (
        { token, productionNumber }:
            {
                token: string,
                productionNumber: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (productionNumber !== undefined) params.productionNumber = productionNumber;

        const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_PRODUCTION_ORDER_DOCUMENT_STATS}`, token, params);
        // console.log("Fetch all production orders api response: ", response);

        const { status, data } = response;
        // console.log("🚀 ~ response1:", data)

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDERS_DOCUMENT_STATES({
                productionOrdersDocumentStats: data?.data,
            }));
        };
    }
);

// Note: Action function fetch production orders list...!
const fetchAgainstPoNumber = createAsyncThunk(
    "sap/fetchAgainstPoNumber",
    async (
        { token, poNumber, sapStatus = "Integrated", apiUrl, lastCount, skipRecords }:
            {
                token: string,
                poNumber: number,
                sapStatus?: string,
                apiUrl: string,
                lastCount: number,
                skipRecords: number,
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number | string } = {};
        if (poNumber !== undefined) params.poNumber = poNumber;
        if (sapStatus !== undefined) params.sapStatus = sapStatus;
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2${apiUrl}`, token, params);
        // console.log("Fetch all production orders api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_LIST_AGAINST_PO({
                listAgainstPo: data?.data,
            }));
        };
    }
);

export {
    addSAPConfiguration,
    checkSAPConfigExist,
    exportDataToCsvFile,
    fetchAll_GRNS,
    fetchAll_INTEGRATED_GRNS,
    fetchAll_PENDING_GRNS,
    fetchAllITR_IT_TRS,
    fetchAllVendorCodes,
    getSAPData,
    handleGetSapStagingDataCounts,
    postRequestToSAP,
    fetchAllProductionOrders,
    fetchIssuesForProductionList,
    fetchRecieptFromProductionList,
    fetchProductionOrdersLinesList,
    closeProductionOrder,
    fetchProductionOrderDocumentStats,
    fetchAgainstPoNumber
};

