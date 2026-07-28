import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_PRODUCTION_ORDER_DATA, FETCH_PRODUCTION_ORDER_DATA_BY_ID, SCAN_PRODUCTION_ORDER, SET_PRODUCTION_ORDER_LOADING } from "@/redux/reducers/production-order-reducer/production-order-reducer";
import { ResHandler } from "@/types/api-types";
import { ListProductionOrder } from "@/types/redux-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const listProductionOrder = createAsyncThunk(
    "productionOrder/fetchGeneratedBarcodeData",
    async ({ lastCount = 40, skipRecord = 0, CreatedDate }:
        {
            lastCount?: number,
            skipRecord?: number,
            CreatedDate?: string
        }, { dispatch }) => {
        dispatch(SET_PRODUCTION_ORDER_LOADING(true));

        const params: { [key: string]: any } = {};
        if (lastCount !== undefined) params.LastCount = lastCount;
        if (skipRecord !== undefined) params.skipRecord = skipRecord;
        if (CreatedDate) params.CreatedDate = CreatedDate;

        const response = await apiGet(
            `/trace-and-track/v2${process.env.NEXT_PUBLIC_LIST_ALL_PRODUCTION_ORDERS}`, '',
            params
        );
        console.log('Fetch all production orders: ', response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDER_DATA({
                poList: data?.data?.data,
                dataCount: data?.data?.totalRecords
            }));
        }

        else {
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
        console.log(`Fetch production order by id ${id}: `, response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_PRODUCTION_ORDER_DATA_BY_ID(data?.data));
        }

        // else {
        //     dispatch(SET_PRODUCTION_ORDER_LOADING(false));
        // }

        return response;
    }
);

const addProductionOrder = createAsyncThunk(
    "productionOrder/addProductionOrder",
    async ({ body, resHandler }: { body: ListProductionOrder; resHandler: any }, { dispatch }) => {
        console.log('Add production order data: ', body);

        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ADD_PRODUCTION_ORDER}`, body);
        console.log("Add production order api response: ", response);

        const { status, data, error } = response;
        resHandler(status, error);

        // dispatch(RESET_HANDLING_UNIT_BY_ITEM_ID());
    }
);

const scanProductionOrder = createAsyncThunk(
    'productionOrder/scanProductionOrder',
    async ({ body, resHandler, apiUrl }: { body: { productionOrderId: string, barcodes: string[] }; resHandler: any, apiUrl: string }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${apiUrl}`, body);
        console.log('Scan api res: ', response);

        const { status, data, error } = response;

        if (status == 201) {
            dispatch(SCAN_PRODUCTION_ORDER(data?.data));
        }
        resHandler(status, error);
    }
)

export {
    addProductionOrder, fetchProductionById, listProductionOrder, scanProductionOrder
};

