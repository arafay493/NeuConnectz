import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_PRODUCTION_ORDER_DATA, FETCH_PRODUCTION_ORDER_DATA_BY_ID } from "@/redux/reducers/production-order-reducer/production-order-reducer";
import { ResHandler } from "@/types/api-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const listProductionOrder = createAsyncThunk(
    "generateBarcode/fetchGeneratedBarcodeData",
    async ({ lastCount, skipRecords }:
        {
            lastCount?: number,
            skipRecords?: number
        }, { dispatch }) => {

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
        };

        return response;
    }
);

const fetchProductionById = createAsyncThunk(
    "generateBarcode/fetchProductionById",
    async ({ id }: { id: string }, { dispatch }) => {
        const response = await apiGet(`/trace-and-track/v2${process.env.NEXT_PUBLIC_FETCH_PRODUCTION_ORDER_BY_ID}`, '', { id });

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDER_DATA_BY_ID(data?.data));
        }

        return response;
    }
);

const addProductionOrder = createAsyncThunk(
    "generateBarcode/addProductionOrder",
    async ({ qty, resHandler }: { qty: number; resHandler: ResHandler }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ADD_PRODUCTION_ORDER}`, { qty });

        const { status, data } = response;

        resHandler(status);
    }
);

export {
    addProductionOrder, listProductionOrder, fetchProductionById
};

