import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { CLEAR_ALL_BIN_TO_BIN_STATES, CLEAR_ALL_OUTBOUND_STATES, CLEAR_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO, CLEAR_ALL_SALES_ORDER_STATES, FETCH_ALL_BIN_TO_BIN, FETCH_ALL_OUTBOUNDS, FETCH_ALL_BIN_TO_BIN_DETAILS_BY_DOC_NO, FETCH_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO, FETCH_ALL_SALES_ORDER, CLEAR_ALL_BIN_TO_BIN_DETAILS_BY_DOC_NO } from "@/redux/reducers/bin-to-bin-reducer/bin-to-bin-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchListAllBinToBin = createAsyncThunk(
    "binToBinTransfer/fetchListAllBinToBin",
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

            const { data: BinToBinTransferData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_BIN_TO_BIN({ data: BinToBinTransferData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_BIN_TO_BIN_STATES())
        }
    }
);

const fetchListAllOutbounds = createAsyncThunk(
    "putaway/fetchListAllOutbounds",
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

            const { data: OutBoundData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_OUTBOUNDS({ data: OutBoundData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_OUTBOUND_STATES())
        }
    }
);

const fetchListAllSalesOrder = createAsyncThunk(
    "putaway/fetchListAllSalesOrder",
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

            const { data: SalesOrderData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_SALES_ORDER({ data: SalesOrderData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_SALES_ORDER_STATES())
        }
    }
);

const fetchListAllSalesOrderDetailsByDocNo = createAsyncThunk(
    "putaway/fetchListAllSalesOrderDetailsByDocNo",
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


            const { data: PickingSalesOrderViewDetailsData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO({ data: PickingSalesOrderViewDetailsData, totalCount: 0 }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO())
        }
    }
);

const fetchListAllBinToBinTransferOrderDetailsByDocNo = createAsyncThunk(
    "putaway/fetchListAllOutboundDetailsByDocNo",
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


            const { data: PickingOutBoundViewDetailsData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_BIN_TO_BIN_DETAILS_BY_DOC_NO({ data: PickingOutBoundViewDetailsData, totalCount: 0 }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_BIN_TO_BIN_DETAILS_BY_DOC_NO())
        }
    }
);

const confirmBinToBinTransferOrders = createAsyncThunk(
    "binToBinTransfer/confirmBinToBinTransferOrders",
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

const confirmPickingOutBoundOrders = createAsyncThunk(
    "putaway/confirmPickingOutBoundOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/IStockTransferOrderFeature/ConfirmStockTransferOrder', payload, token);
            const { status, data, error } = response;
            resHandler(status, data, error);
        } catch (error) {
            resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const confirmPickingSalesOrders = createAsyncThunk(
    "putaway/confirmPickingSalesOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISalesOrderFeature/ConfirmSalesOrder', payload, token);
            const { status, data, error } = response;
            resHandler(status, data, error);
        } catch (error) {
            resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const postBinToBinTransferOrders = createAsyncThunk(
    "binToBin/postBinToBinTransferOrders",
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

const postPickingOutBoundOrders = createAsyncThunk(
    "putaway/postPickingOutBoundOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISapFeature/PostStoToSap', payload, token);
            // console.log("payload>>>>>>>> " , payload)
            const { data, status } = response;
            const { message, error } = data?.data;
            resHandler(status, message, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const postPickingSalesOrders = createAsyncThunk(
    "putaway/postPickingSalesOrders",
    async (
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/ISapFeature/PostSalesOrderToSap', payload, token);
            // console.log("payload>>>>>>>> " , payload)
            const { data, status } = response;
            const { message, error } = data?.data;
            resHandler(status, message, error);
        } catch (error) {
            // resHandler(400, error)
            console.log("response error", error)
        }

    }
);

const deleteBinToBinTransferOrders = createAsyncThunk(
    "binToBin/deleteBinToBinTransferOrders",
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
    fetchListAllBinToBin,
    fetchListAllOutbounds,
    fetchListAllSalesOrder,
    fetchListAllSalesOrderDetailsByDocNo,
    fetchListAllBinToBinTransferOrderDetailsByDocNo,
    confirmBinToBinTransferOrders,
    confirmPickingOutBoundOrders,
    confirmPickingSalesOrders,
    postBinToBinTransferOrders,
    postPickingOutBoundOrders,
    postPickingSalesOrders,
    deleteBinToBinTransferOrders,
};

