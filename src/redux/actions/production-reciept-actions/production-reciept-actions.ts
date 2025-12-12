import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { CLEAR_ALL_INBOUND_STO_DETAILS_STATES, CLEAR_ALL_INBOUND_STO_STATES, FETCH_ALL_INBOUND_STO, FETCH_ALL_INBOUND_STO_DETAILS_BY_DOC_NO } from "@/redux/reducers/inbound-sto-reducer/inbound-sto-reducer";
import { CLEAR_ALL_PRODUCTION_RECIEPT_DETAILS_STATES, CLEAR_ALL_PRODUCTION_RECIEPT_STATES, FETCH_ALL_PRODUCTION_RECIEPT, FETCH_ALL_PRODUCTION_RECIEPT_DETAILS_BY_DOC_NO } from "@/redux/reducers/production-reciept-reducer/production-reciept-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchListAllProductionReciept = createAsyncThunk(
    "productionReciept/fetchListAllProductionReciept",
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

            const { data: ProductionRecieptData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PRODUCTION_RECIEPT({ data: ProductionRecieptData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PRODUCTION_RECIEPT_STATES())
        }
    }
);

const fetchListAllProductionRecieptDetailsByDocNo = createAsyncThunk(
    "productionReciept/fetchListAllProductionRecieptDetailsByDocNo",
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


            const { data: ProductionRecieptViewDetailsData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PRODUCTION_RECIEPT_DETAILS_BY_DOC_NO({ data: ProductionRecieptViewDetailsData, totalCount: 0 }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PRODUCTION_RECIEPT_DETAILS_STATES())
        }
    }
);

const confirmProductionReciept = createAsyncThunk(
    "productionReciept/confirmProductionReciept",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/IProductionReceiptFeature/ConfirmProductionReceipt', payload, token);
            const { status, data, error } = response;
            resHandler(status, data, error);
        } catch (error) {
            resHandler(400, error)
            console.log("response error", error)
        }

    }
);


const postProductionReciept = createAsyncThunk(
    "productionReciept/postProductionReciept",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISapFeature/PostProductionReceiptToSap', payload, token);
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

const deleteProductionReciept = createAsyncThunk(
    "productionReciept/deleteProductionReciept",
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
    fetchListAllProductionReciept,
    fetchListAllProductionRecieptDetailsByDocNo,
    confirmProductionReciept,
    postProductionReciept,
    deleteProductionReciept
};

