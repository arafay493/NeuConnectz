import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_ITEM_CODES, FETCH_RECONCILIATION_DATA, FETCH_RECONCILIATION_ITS, FETCH_RECONCILIATION_TRS, UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA } from "@/redux/reducers/reconciliation-reducer/reconciliation-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface FetchReconciliationTableProps {
    authToken: string;
    fromWarehouseCode: string;
    toWarehouseCode: string;
    date: string;
    itemCode?: string | null
}

// Note: Action function to fetch all warehouses...!
const fetchReconciliationData = createAsyncThunk(
    "reconciliation/fetchReconciliationData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date }: FetchReconciliationTableProps, { dispatch }) => {

        const params = {
            fromWarehouseCode,
            toWarehouseCode,
            dateTime: date
        }

        const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetInventoryAndTransferReceiptItems`, authToken, params)

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_RECONCILIATION_DATA(data?.data));
        };
    }
);

const fetchUnReconciledITSData = createAsyncThunk(
    "reconciliation/fetchUnReconciledITSData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date, itemCode }: FetchReconciliationTableProps, { dispatch }) => {

        const params = {
            fromWarehouseCode,
            toWarehouseCode,
            dateTime: date,
            itemCode: itemCode || ""
        }

        const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetUnreconciledITs`, authToken, params)

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_RECONCILIATION_ITS(data?.data));
        } else {
            dispatch(FETCH_RECONCILIATION_ITS([]));
        };
    }
);

const fetchUnReconciledTRSData = createAsyncThunk(
    "reconciliation/fetchUnReconciledTRSData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date, itemCode }: FetchReconciliationTableProps, { dispatch }) => {

        const params = {
            fromWarehouseCode,
            toWarehouseCode,
            dateTime: date,
            itemCode: itemCode || ""
        }

        const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetUnreconciledTRs`, authToken, params)

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_RECONCILIATION_TRS(data?.data));
        } else {
            dispatch(FETCH_RECONCILIATION_TRS([]));
        };
    }
);

const fetchItemCodesData = createAsyncThunk(
    "reconciliation/fetchItemCodesData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date, itemCode }: FetchReconciliationTableProps, { dispatch }) => {

        const params: { [key: string]: string | number } = {
            fromWarehouseCode: fromWarehouseCode || "",
            toWarehouseCode: toWarehouseCode || "",
            dateTime: date || "",
            itemCode: itemCode || "",
        };

        const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetReconciliationItems`, authToken, params)

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ITEM_CODES(data?.data));
        } else {
            dispatch(FETCH_ITEM_CODES([]));
        };
    }
);

const postAutoReconcile = createAsyncThunk(
    "reconciliation/postAutoReconcile",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date, resHandler }: any, { dispatch }) => {

        const body: any = {
            fromWarehouseCode: fromWarehouseCode,
            toWarehouseCode: toWarehouseCode,
            dateTime: date
        }

        const response = await apiPost(`/neu-connect/v2/IReconciliationFeature/ReconcileInventory`, body)

        const { status, data } = response;

        if (status == 200) {
            resHandler(data)
        };
    }
);

const postCreateRemainingAdjustedTR = createAsyncThunk(
    "reconciliation/postCreateRemainingAdjustedTR",
    async ({ authToken, fromWarehouseCode, toWareHouseCode, itemCode, quantity, itIds, trIds, resHandler }: any, { dispatch }) => {

        const body: any = {
            fromWareHouseCode: fromWarehouseCode,
            toWareHouseCode: toWareHouseCode,
            itemCode: itemCode,
            quantity: quantity,
            itIds: itIds,
            trIds: trIds
        }

        const response = await apiPost(`/neu-connect/v2/IReconciliationFeature/CreateRemainingAdjustedTR`, body)

        const { status, data } = response;

        if (status == 200) {
            resHandler(data)
        };
    }
);

const postReverseITofTRInReconciliation = createAsyncThunk(
    "reconciliation/postReverseITofTRInReconciliation",
    async ({ authToken, fromWarehouseCode, toWareHouseCode, itemCode, quantity, itIds, trIds, resHandler }: any, { dispatch }) => {

        const body: any = {
            fromWareHouseCode: fromWarehouseCode,
            toWareHouseCode: toWareHouseCode,
            itemCode: itemCode,
            quantity: quantity,
            itIds: itIds,
            trIds: trIds
        }

        const response = await apiPost(`/neu-connect/v2/IReconciliationFeature/ReverseITofTRInReconciliation`, body)

        const { status, data } = response;

        if (status == 200) {
            resHandler(data)
        };
    }
);

const postTransferToLostWarehouse = createAsyncThunk(
    "reconciliation/postTransferToLostWarehouse",
    async ({ authToken, fromWarehouseCode, toWareHouseCode, itemCode, quantity, itIds, trIds, resHandler }: any, { dispatch }) => {

        const body: any = {
            itemCode: itemCode,
            quantity: quantity,
            itIds: itIds,
            trIds: trIds
        }

        const response = await apiPost(`/neu-connect/v2/IReconciliationFeature/TransferToLostWarehouse`, body)

        const { status, data } = response;

        if (status == 200) {
            resHandler(data)
        };
    }
);

const postCreateAdjustedITRInReconciliation = createAsyncThunk(
    "reconciliation/postCreateAdjustedITRInReconciliation",
    async ({ authToken, fromWarehouseCode, toWareHouseCode, itemCode, quantity, itIds, trIds, resHandler }: any, { dispatch }) => {

        const body: any = {
            fromWareHouseCode: fromWarehouseCode,
            toWareHouseCode: toWareHouseCode,
            itemCode: itemCode,
            quantity: quantity,
            itIds: itIds,
            trIds: trIds
        }

        const response = await apiPost(`/neu-connect/v2/IReconciliationFeature/CreateAdjustedITRInReconciliation`, body)

        const { status, data } = response;

        if (status == 200) {
            resHandler(data)
        };
    }
);

export {
    fetchReconciliationData,
    fetchUnReconciledITSData,
    fetchUnReconciledTRSData,
    fetchItemCodesData,
    postAutoReconcile,
    postCreateRemainingAdjustedTR,
    postReverseITofTRInReconciliation,
    postTransferToLostWarehouse,
    postCreateAdjustedITRInReconciliation
};
