import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_GENERATE_BARCODE_DATA } from "@/redux/reducers/generate-barcode-reducer/generate-barcode-reducer";
import { ResHandler } from "@/types/api-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchGeneratedBarcodeData = createAsyncThunk(
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
            `/trace-and-track/v2${process.env.NEXT_PUBLIC_FETCH_BARCODE_DATA}`, '',
            params
        );

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_GENERATE_BARCODE_DATA(data?.data));
        };

        return response;
    }
);

const addGenerateBarcode = createAsyncThunk(
    "generateBarcode/addGenerateBarcode",
    async ({ qty, resHandler }: { qty: number; resHandler: ResHandler }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ADD_GENERATE_BARCODE}`, { qty });

        const { status, data } = response;

        resHandler(status);
    }
);


const sendGenerateBarcodeToEmail = createAsyncThunk(
    "generateBarcode/sendGenerateBarcodeToEmail",
    async ({ id, email, resHandler }: { id: string; email: string; resHandler: ResHandler }, { dispatch }) => {

        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_SEND_GENERATE_BARCODE}`, { id, email });

        const { status, data } = response;

        resHandler(status);
    }
);

export {
    addGenerateBarcode, fetchGeneratedBarcodeData, sendGenerateBarcodeToEmail
};

