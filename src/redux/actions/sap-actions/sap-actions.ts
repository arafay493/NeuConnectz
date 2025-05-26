// Note: All SAP action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import API_METHODS from "@/constants/api-methods";
import { AddSAPConfigDataType } from "@/types/modules/sap-types/sap-types";
import { ResHandler } from "@/types/api-types";
import { UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA, FETCH_ALL_ITR_IT_TRS } from "@/redux/reducers/sap-reducer/sap-reducer";

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

// Note: Action function to post ITR, TR, IT request to SAP...!
const postRequestToSAP = createAsyncThunk(
    "sap/postRequestToSAP",
    async (
        { token, apiUrl, resHandler }:
            {
                token: string,
                apiUrl: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        console.log("Token: ", token);
        console.log("API URL: ", apiUrl);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: { userName: "Prince Ahmed" },
                headers: {
                    "Api-Url": apiUrl,
                    "Auth-Token": token,
                }
            });
            console.log("Response in SAP action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            console.log('Error occured in post request to SAP api integration: ', error);
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
        { token, dataStatus }:
            {
                token: string,
                dataStatus: "Pending" | "Integrated"
            },
        { dispatch }
    ) => {
        // console.log("Auth token: ", token);
        // console.log("Status: ", dataStatus);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": `${process.env.NEXT_PUBLIC_FETCH_ALL_ITR_IT_TRS_LIST}=${dataStatus}`,
                    "Auth-Token": token
                }
            });
            // console.log("Response in sap action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_ITR_IT_TRS(data?.data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all users api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_SAP_DATA());
        };
    }
);


export {
    addSAPConfiguration,
    postRequestToSAP,
    fetchAllITR_IT_TRS
};