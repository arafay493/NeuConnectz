import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { CLEAR_ALL_INBOUND_STO_DETAILS_STATES, CLEAR_ALL_INBOUND_STO_STATES, FETCH_ALL_INBOUND_STO, FETCH_ALL_INBOUND_STO_DETAILS_BY_DOC_NO } from "@/redux/reducers/inbound-sto-reducer/inbound-sto-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchListAllInboundSto = createAsyncThunk(
    "inboundSto/fetchListAllInboundSto",
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

            const { data: InboundStoData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_INBOUND_STO({ data: InboundStoData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_INBOUND_STO_STATES())
        }
    }
);

const fetchListAllInboundStoDetailsByDocNo = createAsyncThunk(
    "inboundSto/fetchListAllInboundStoDetailsByDocNo",
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
                docNum: docNumber
            };
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2${apiUrl}`, authToken, params);

            const { status, data } = response;


            const { data: InboundStoViewDetailsData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_INBOUND_STO_DETAILS_BY_DOC_NO({ data: InboundStoViewDetailsData, totalCount: 0 }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_INBOUND_STO_DETAILS_STATES())
        }
    }
);

const confirmInBoundSto = createAsyncThunk(
    "inboundSto/confirmInBoundSto",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/IBinManagementFeature/ConfirmBinTransfer', payload, token);
            const { status, data, error } = response;
            resHandler(status, data, error);
        } catch (error) {
            resHandler(400, error)
            console.log("response error", error)
        }

    }
);


const postInBoundSto = createAsyncThunk(
    "inboundSto/postInBoundSto",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISapFeature/PostBinTransferToSap', payload, token);
            // console.log("payload>>>>>>>> " , payload)
            const { data, status } = response;
            const { message, error } = data;
            resHandler(status, message, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const deleteInBoundSto = createAsyncThunk(
    "inboundSto/deleteInBoundSto",
    async (
        { apiUrl, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPut(`/neu-connect/v2${apiUrl}`, token);
            // console.log("payload>>>>>>>> " , payload)
            const { data, status, error } = response;
            const { message } = data;
            resHandler(status, message, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }
    }
);

export {
    fetchListAllInboundSto,
    fetchListAllInboundStoDetailsByDocNo,
    confirmInBoundSto,
    postInBoundSto,
    deleteInBoundSto
};

