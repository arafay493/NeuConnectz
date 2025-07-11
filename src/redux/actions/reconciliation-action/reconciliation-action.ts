// Note: All warehouse action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { handleRefreshToken } from "@/constants/refresh-token";
import { WareHouseDataObj } from "@/types/modules/warehouse-types/warehouse-types";
import { ResHandler } from "@/types/api-types";
import { FETCH_RECONCILIATION_DATA, UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA } from "@/redux/reducers/reconciliation-reducer/reconciliation-reducer";

interface FetchReconciliationTableProps {
    authToken: string;
    fromWarehouseCode: string;
    toWarehouseCode: string;
    date: string;
}

// Note: Action function to fetch all warehouses...!
const fetchReconciliationData = createAsyncThunk(
    "reconciliation/fetchReconciliationData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date }: FetchReconciliationTableProps, { dispatch }) => {

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": `${process.env.NEXT_PUBLIC_FETCH_IT_AND_TR_RECONCILIATION_DATA}?fromWarehouseCode=${fromWarehouseCode}&toWarehouseCode=${toWarehouseCode}&dateTime=${date}`,
                    "Auth-Token": authToken
                }
            });
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_RECONCILIATION_DATA(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occurred in fetch all warehouses api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA());
        };
    }
);

// Note: Action function to fetch warehouses list by user id...!
// const fetchWarehousesListByUserId = createAsyncThunk(
//     "warehouse/fetchWarehousesListByUserId",
//     async (
//         { authToken, userId }: { authToken: string, userId: string },
//         { dispatch }
//     ) => {
//         // console.log("Auth token: ", authToken);
//         // console.log("User id: ", userId);

//         try {
//             const response = await axios({
//                 method: API_METHODS.GET,
//                 url: apiRequestRoutes.getRequest,
//                 params: { userId },
//                 headers: {
//                     "Api-Url": process.env.NEXT_PUBLIC_ADD_FETCH_WAREHOUSES_BY_USER_ID,
//                     "Auth-Token": authToken
//                 }
//             });
//             // console.log("Response in warehouse action: ", response);
//             const { status, data } = response;

//             if (status == 200) {
//                 dispatch(FETCH_WAREHOUSES_BY_USER_ID(data?.data));
//             };
//         }

//         catch (error: any) {
//             // console.log('Error occured in fetchcing warehouses list by user id api integration: ', error);
//             const { status, data } = error?.response;

//             // 401:
//             if (status == 401) handleRefreshToken(data?.error);

//             // 403
//             else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA());

//             // 404
//             else if (status == 404) dispatch(FETCH_WAREHOUSES_BY_USER_ID([]));
//         };
//     }
// );

// Note: Action function to assign warehouse to user...!
// const assignWareHouseToUser = createAsyncThunk(
//     "warehouse/assignWareHouseToUser",
//     async (
//         { wareHouseData, token, resHandler }:
//             {
//                 wareHouseData: WareHouseDataObj,
//                 token: string,
//                 resHandler: ResHandler
//             },
//         { dispatch }
//     ) => {
//         // console.log("Token in warehouse action: ", token);
//         // console.log("Assign warehouse to user data in warehouse action: ", wareHouseData);

//         try {
//             const response = await axios({
//                 method: API_METHODS.POST,
//                 url: apiRequestRoutes.postRequest,
//                 data: wareHouseData,
//                 headers: {
//                     "Api-Url": process.env.NEXT_PUBLIC_ASSIGN_WAREHOUSE_TO_USER,
//                     "Auth-Token": token
//                 }
//             });
//             // console.log("Response in warehouse action: ", response);
//             const { status, data } = response;

//             if (status == 201) {
//                 resHandler(response);
//             };
//         }

//         catch (error: any) {
//             // console.log('Error occured in assign warehouse to user api integration: ', error);
//             resHandler(error?.response);

//             const { status, data } = error?.response;

//             // 401:
//             if (status == 401) {
//                 handleRefreshToken(data?.error);
//             };
//         };
//     }
// );

export {
    fetchReconciliationData,
    // fetchWarehousesListByUserId,
    // assignWareHouseToUser
};