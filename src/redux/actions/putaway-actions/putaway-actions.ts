import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { FETCH_ALL_PLANTS_CODES_BY_USER } from "@/redux/reducers/plants-reducer/plants-reducer";
import { CLEAR_ALL_PUTAWAY_DETAILS_BY_DOC_NO, CLEAR_ALL_PUTAWAY_STATES, FETCH_ALL_PUTAWAY, FETCH_ALL_PUTAWAY_DETAILS_BY_DOC_NO } from "@/redux/reducers/putaway-reducer/putaway-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchListAllPutAway = createAsyncThunk(
    "putaway/fetchListAllPutAway",
    async (
        { authToken, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                apiUrl: string
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const params: { [key: string]: number } = {};
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2${apiUrl}`, authToken, params);

            const { status, data } = response;

            const { data: PutAwayData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PUTAWAY({ data: PutAwayData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PUTAWAY_STATES())
        }
    }
);

const fetchListAllPutAwayDetalisByDocNo = createAsyncThunk(
    "putaway/fetchListAllPutAway",
    async (
        { authToken, docNumber, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                docNumber: number,
                apiUrl: string
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const params: { [key: string]: number | string } = {
                DocNum: docNumber
            };
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2${apiUrl}`, authToken, params);

            const { status, data } = response;


            const { data: PutAwayViewDetailsData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PUTAWAY_DETAILS_BY_DOC_NO({ data: PutAwayViewDetailsData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PUTAWAY_DETAILS_BY_DOC_NO())
        }
    }
);

const confirmPutAwayOrders = createAsyncThunk(
    "putaway/confirmPutAwayOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/IPutAwayFeature/ConfirmPutAway', payload, token);
            const { status, data, error } = response;
            resHandler(status, data, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const postPutAwayOrders = createAsyncThunk(
    "putaway/postPutAwayOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISapFeature/PostPutAwayAgainstGR', payload, token);
            // console.log("payload>>>>>>>> " , payload)
            const { data, status} = response;
            const { message, error } = data?.data;
            resHandler(status, message, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const deletePutAwayOrders = createAsyncThunk(
    "putaway/deletePutAwayOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPut('/neu-connect/v2/IPutAwayFeature/DeletePutAwayRequest', payload, token);
            // console.log("payload>>>>>>>> " , payload)
            const { status, error} = response;
            // const { message } = data
            // resHandler(status, message, error);
            resHandler(status, "", error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

export {
    fetchListAllPutAway,
    fetchListAllPutAwayDetalisByDocNo,
    confirmPutAwayOrders,
    postPutAwayOrders,
    deletePutAwayOrders
};

