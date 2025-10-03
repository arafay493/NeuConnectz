import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_PRODUCTION_ORDER_DATA, FETCH_PRODUCTION_ORDER_DATA_BY_ID, SCAN_PRODUCTION_ORDER, SET_PRODUCTION_ORDER_LOADING } from "@/redux/reducers/production-order-reducer/production-order-reducer";
import { ResHandler } from "@/types/api-types";
import { ListProductionOrder } from "@/types/redux-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const listProductionOrder = createAsyncThunk(
    "productionOrder/fetchGeneratedBarcodeData",
    async ({ lastCount, skipRecords }:
        {
            lastCount?: number,
            skipRecords?: number
        }, { dispatch }) => {
        dispatch(SET_PRODUCTION_ORDER_LOADING(true));

        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.LastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(
            `/trace-and-track/v2${process.env.NEXT_PUBLIC_LIST_ALL_PRODUCTION_ORDERS}`, '',
            params
        );

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDER_DATA(data?.data));
        } else {
            dispatch(SET_PRODUCTION_ORDER_LOADING(false));
        }

        return response;
    }
);

const fetchProductionById = createAsyncThunk(
    "productionOrder/fetchProductionById",
    async ({ id }: { id: string }, { dispatch }) => {
        dispatch(SET_PRODUCTION_ORDER_LOADING(true));

        const response = await apiGet(`/trace-and-track/v2${process.env.NEXT_PUBLIC_FETCH_PRODUCTION_ORDER_BY_ID}/${id}`);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDER_DATA_BY_ID(data?.data));
        } else {
            dispatch(SET_PRODUCTION_ORDER_LOADING(false));
        }

        return response;
    }
);

const addProductionOrder = createAsyncThunk(
    "productionOrder/addProductionOrder",
    async ({ body, resHandler }: { body: ListProductionOrder; resHandler: ResHandler }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ADD_PRODUCTION_ORDER}`, body);

        const { status, data } = response;

        resHandler(status);

        // dispatch(RESET_HANDLING_UNIT_BY_ITEM_ID());
    }
);

const scanProductionOrder = createAsyncThunk(
    'productionOrder/scanProductionOrder',
    async ({ body, resHandler }: { body: { productionOrderId: string, barcodes: string[] }; resHandler: ResHandler }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_SCAN_PRODUCTION_ORDER}`, body);

        const { status, data } = response;

        if (status == 201) {
            dispatch(SCAN_PRODUCTION_ORDER(data?.data));
        }

        resHandler(status);

    }
)

export {
    addProductionOrder, fetchProductionById, listProductionOrder, scanProductionOrder
};

