import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenerateBarcodeStateProps } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GenerateBarcodeStateProps = {
    generateBarcodeData: null,
    totalCount: 0,
};

const generateBarcode = createSlice({
    name: "generateBarcode",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA: (state) => {
            state.generateBarcodeData = null;
            state.totalCount = 0;
        },

        FETCH_GENERATE_BARCODE_DATA: (state, action: PayloadAction<any>) => {
            // Handle both paginated response { data: [...], totalCount: number } and simple array
            if (action?.payload?.data && Array.isArray(action?.payload?.data)) {
                state.generateBarcodeData = action.payload.data;
                state.totalCount = action?.payload?.totalCount || 0;
            } else if (Array.isArray(action?.payload)) {
                state.generateBarcodeData = action.payload;
                state.totalCount = action.payload.length;
            } else {
                state.generateBarcodeData = null;
                state.totalCount = 0;
            }
        },

        CLEAR_ALL_GENERATE_BARCODE_STATES: (state) => {
            state.generateBarcodeData = null;
            state.totalCount = 0;
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA,
        FETCH_GENERATE_BARCODE_DATA,
        CLEAR_ALL_GENERATE_BARCODE_STATES
    } = generateBarcode.actions;
export default generateBarcode.reducer;