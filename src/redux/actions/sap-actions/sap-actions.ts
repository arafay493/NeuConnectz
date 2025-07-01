// Note: All SAP action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import API_METHODS from "@/constants/api-methods";
import { AddSAPConfigDataType } from "@/types/modules/sap-types/sap-types";
import { ResHandler } from "@/types/api-types";
import {
    CHECK_SAP_CONFIG_EXIST,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA,
    FETCH_ALL_ITR_IT_TRS,
    FETCH_ALL_GRNS
} from "@/redux/reducers/sap-reducer/sap-reducer";

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
        // console.log("Token: ", token);
        // console.log("Add SAP configuration data in SAP action: ", sapConfigData);

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
            // console.log("Response in SAP action: ", response);
            const { status, data } = response;

            if (status == 200) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in Add SAP configuration api integration: ', error);
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
        // console.log("Token: ", token);
        // console.log("Type: ", type);
        // console.log("API URL: ", apiUrl);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: { userName: type },
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": token,
                }
            });
            // console.log("Response in SAP action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in post request to SAP api integration: ', error);
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
        { token, dataStatus, handleLoading, type }:
            {
                token: string,
                dataStatus: string,
                handleLoading: () => void,
                type?: "ITR" | "TR" | "IT"
            },
        { dispatch }
    ) => {
        // console.log("Auth token: ", token);
        // console.log("Status: ", dataStatus);
        // console.log("Type: ", type);

        const apiUrl = !type ? `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}` :
            `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}&type=${type}`;
        // console.log("Api url: ", apiUrl);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": token
                }
            });
            // console.log("Response in sap action: ", response);
            const { status } = response;
            // console.log("Api res: ", response);

            if (status == 200) {
                dispatch(FETCH_ALL_ITR_IT_TRS({
                    listData: response?.data?.data?.data,
                }));
                handleLoading(); // Disable loading state...!
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all ITR, TR, IT data api integration: ', error);
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
        { token, sapStatus, handleLoading }:
            {
                token: string,
                sapStatus: string,
                handleLoading: () => void,
            },
        { dispatch }
    ) => {
        // console.log("Auth token: ", token);
        // console.log("Sap Status: ", sapStatus);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${sapStatus}`,
                    "Auth-Token": token
                }
            });
            // console.log("Response in sap action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_GRNS({
                    grnsData: data?.data?.items,
                }));
                handleLoading(); // Disable loading state...!
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all GRNS data api integration: ', error);
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
        console.log("Auth token: ", token);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_CHECK_SAP_CONFIG_EXIST,
                    "Auth-Token": token
                }
            });
            console.log("Response in sap action: ", response);
            const { status, data } = response;

            if (status == 200) dispatch(CHECK_SAP_CONFIG_EXIST(data?.data));
        }

        catch (error: any) {
            console.log('Error occured in check SAP config exist api integration: ', error);
            // const { status, data } = error?.response;

            // 401:
            // if (status == 401) handleRefreshToken(data?.error);

            // 403
            // else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);

export {
    addSAPConfiguration,
    postRequestToSAP,
    fetchAllITR_IT_TRS,
    fetchAll_GRNS,
    checkSAPConfigExist
};