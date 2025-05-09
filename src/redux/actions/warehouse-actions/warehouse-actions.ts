// Note: All warehouse action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { FETCH_ALL_WAREHOUSES, UNAUTHORIZE_USER_TRYING_TO_ACCESS_WAREHOUSE_DATA } from "@/redux/reducers/warehouse-reducer/warehouse-reducer";
import { sessionExpired } from "@/constants/session-expired";
import { WareHouseDataObj } from "@/types/modules/warehouse-types/warehouse-types";
import { ResHandler } from "@/types/api-types";

// Note: Action function to fetch all warehouses...!
const fetchAllWareHouses = createAsyncThunk(
    "warehouse/fetchAllWareHouses",
    async (authToken: string, { dispatch }) => {
        // console.log("Auth token: ", authToken);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_WAREHOUSES,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in warehouse action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_WAREHOUSES(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all warehouses api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) sessionExpired(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_WAREHOUSE_DATA());
        };
    }
);



// Note: Action function to assign warehouse to user...!
const assignWareHouseToUser = createAsyncThunk(
    "warehouse/assignWareHouseToUser",
    async (
        { wareHouseData, token, resHandler }:
            {
                wareHouseData: WareHouseDataObj,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        // console.log("Token in warehouse action: ", token);
        // console.log("Assign warehouse to user data in warehouse action: ", wareHouseData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: wareHouseData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ASSIGN_WAREHOUSE_TO_USER,
                    "Auth-Token": token
                }
            });
            // console.log("Response in warehouse action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in assign warehouse to user api integration: ', error);
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                sessionExpired(data?.error);
            };
        };
    }
);

export {
    fetchAllWareHouses,
    assignWareHouseToUser
};