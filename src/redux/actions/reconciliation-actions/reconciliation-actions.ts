// Note: All Reconciliation action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import API_METHODS from "@/constants/api-methods";
import {
    FETCH_IT_AND_TR_DATA,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA
} from "@/redux/reducers/reconciliation-reducer/reconciliation-reducer";

// Note: Action function to get IT and TR data...!
const getITAndTRData = createAsyncThunk(
    "sap/getITAndTRData",
    async (
        { token, fromWhCode, toWhCode, dateAndTime, loadingHandler }:
            {
                token: string,
                fromWhCode: string,
                toWhCode: string,
                dateAndTime: any,
                loadingHandler: () => void
            },
        { dispatch }
    ) => {
        // console.log("Auth token: ", token);
        // console.log("From WH Code: ", fromWhCode);
        // console.log("To WH Code: ", toWhCode);
        // console.log("Date and Time: ", dateAndTime);

        const apiParams = `fromWarehouseCode=${fromWhCode}&toWarehouseCode=${toWhCode}&dateTime=${dateAndTime}`;

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": `${process.env.NEXT_PUBLIC_FETCH_IT_AND_TR_RECONCILIATION_DATA}?${apiParams}`,
                    "Auth-Token": token
                }
            });
            // console.log("Response in reconciliation action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_IT_AND_TR_DATA(data?.data));
                loadingHandler();
            };
        }

        catch (error: any) {
            // console.log('Error occured in getting IT and TR data from fetching reconciliation data api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA());
        };
    }
);

export {
    getITAndTRData
};