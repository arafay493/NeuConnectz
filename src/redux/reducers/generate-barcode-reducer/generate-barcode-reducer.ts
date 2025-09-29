import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenerateBarcodeStateProps } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GenerateBarcodeStateProps = {
    generateBarcodeData: null,
    totalCount: 0,
    loading: false
};

const generateBarcode = createSlice({
    name: "generateBarcode",
    initialState,
    reducers: {
        SET_GENERATE_BARCODE_LOADING: (state, action) => {
            state.loading = action.payload;
        },

        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA: (state) => {
            state.generateBarcodeData = null;
            state.totalCount = 0;
            state.loading = false;
        },

        FETCH_GENERATE_BARCODE_DATA: (state, action: PayloadAction<any>) => {
            // Handle both paginated response { data: [...], totalCount: number } and simple array
            if (action?.payload?.batches && Array.isArray(action?.payload?.batches)) {
                state.generateBarcodeData = action.payload.batches;
                state.totalCount = action?.payload?.totalCount || 0;
            } else if (Array.isArray(action?.payload)) {
                state.generateBarcodeData = action.payload;
                state.totalCount = action.payload.length;
            } else {
                state.generateBarcodeData = null;
                state.totalCount = 0;
            }
            state.loading = false;
        },

        CLEAR_ALL_GENERATE_BARCODE_STATES: (state) => {
            state.generateBarcodeData = null;
            state.totalCount = 0;
            state.loading = false;
        },
    }
});

export const
    {
        SET_GENERATE_BARCODE_LOADING,
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA,
        FETCH_GENERATE_BARCODE_DATA,
        CLEAR_ALL_GENERATE_BARCODE_STATES
    } = generateBarcode.actions;
export default generateBarcode.reducer;